
import React, { createRef } from "react";
import { StyleSheet, Text, View, FlatList, PanResponder, Animated, SafeAreaView, Button, TouchableOpacity, TouchableHighlight, TextInput } from "react-native";
import * as firebase from "firebase";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Overlay } from "react-native-elements";
import RadioButton from "../components/RadioButton";

const contactIconType = {
	call: "ios-call",
	mail: "ios-mail",
	location: "ios-pin"
};

const options = Object.keys(contactIconType);

const navHeight = 0; //Header.HEIGHT;

function immutableMove(arr, from, to) {
	return arr.reduce((prev, current, idx, self) => {
		if (from === to) {
			prev.push(current);
		}
		if (idx === from) {
			return prev;
		}
		if (from < to) {
			prev.push(current);
		}
		if (idx === to) {
			prev.push(self[from]);
		}
		if (from > to) {
			prev.push(current);
		}
		return prev;
	}, []);
}

class Anchor extends React.Component {
	_handlePress = () => {
		Linking.openURL(this.props.href);
		this.props.onPress && this.props.onPress();
	};

	render() {
		return <Text style={styles.feedbackHead} onPress={this._handlePress}>
			{this.props.title}
		</Text>;
	}
}

export default class ContactAdmin extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		title: "Edit Contacts",
		headerRight: <TouchableOpacity onPress={() => {
			navigation.state.params.saveEditContacts(navigation.goBack);
		}}>
			<Text style={styles.adb53c780af6511ea88c25dbffc760ad0}>
				Save
        </Text>
		</TouchableOpacity>
	});

	state = {
		dragging: false,
		draggingIdx: -1,
		data: this.props.navigation.getParam("contactInfo") || [],

		modalVisible: false,
		editIdx: -1,
		editType: "",
		editPhoneNumber: "",
		editEmail: "",
		editTitle: "",
		editSubHeader: ""
	};

	setEditType = t => this.setState({ editType: t });
	resetEditFields = callback => this.setState({
		editIdx: -1,
		editType: "",
		editPhoneNumber: "",
		editEmail: "",
		editTitle: "",
		editSubHeader: ""
	}, () => typeof callback === "function" && callback());

	updateData = callback => {
		const {
			data,
			editIdx = -1,
			editType = "",
			editPhoneNumber = "",
			editEmail = "",
			editTitle = "",
			editSubHeader = ""
		} = this.state;

		const updatedData = {
			type: editType,
			phoneNumber: editPhoneNumber,
			email: editEmail,
			headerText: editTitle,
			headerSubTexts: editSubHeader
		};

		if (editIdx > -1) {
			// update current contact info
			data[editIdx] = updatedData;
			this.setState({ data }, () => typeof callback === "function" && callback());
		} else {
			//add new contact info
			data.push(updatedData);
			this.setState({ data }, () => typeof callback === "function" && callback());
		}
	};

	deleteData = callback => {
		const { data, editIdx } = this.state;

		if (editIdx > -1) {
			data.splice(editIdx, 1);
			this.setState({ data: data }, () => typeof callback === "function" && callback());
		}
	};

	point = new Animated.ValueXY();
	currentY = 0;
	scrollOffset = 0;
	flatlistTopOffset = 0;
	rowHeight = 0;
	currentIdx = -1;
	active = false;
	flatList = createRef();
	flatListHeight = 0;
	itemsHeight = {};

	constructor(props) {
		super(props);

		this._panResponder = PanResponder.create({
			// Ask to be the responder:
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

			onPanResponderGrant: (evt, gestureState) => {
				// The gesture has started. Show visual feedback so the user knows
				// what is happening!
				// gestureState.d{x,y} will be set to zero now
				const orginPoint = gestureState.y0;
				this.currentIdx = this.yToIndex(orginPoint);
				this.currentY = gestureState.y0;

				Animated.event([{ y: this.point.y }])({
					y: orginPoint - this.rowHeight / 2 - navHeight
				});
				this.active = true;
				this.setState({ dragging: true, draggingIdx: this.currentIdx }, () => {
					this.animateList();
				});
			},
			onPanResponderMove: (evt, gestureState) => {
				const currentY = gestureState.moveY;
				this.currentY = currentY;

				Animated.event([{ y: this.point.y }])({ y: currentY - navHeight * 2 });
				// The most recent move distance is gestureState.move{X,Y}
				// The accumulated gesture distance since becoming responder is
				// gestureState.d{x,y}
			},
			onPanResponderTerminationRequest: (evt, gestureState) => false,
			onPanResponderRelease: (evt, gestureState) => {
				// The user has released all touches while this view is the
				// responder. This typically means a gesture has succeeded
				this.reset();
			},
			onPanResponderTerminate: (evt, gestureState) => {
				// Another component has become the responder, so this gesture
				// should be cancelled
				this.reset();
			},
			onShouldBlockNativeResponder: (evt, gestureState) => {
				// Returns whether this component should block native components from becoming the JS
				// responder. Returns true by default. Is currently only supported on android.
				return true;
			}
		});
	}

	componentDidMount() {
		this.props.navigation.setParams({
			saveEditContacts: this.saveEditContacts
		});
	}

	saveEditContacts = callback => {
		const docData = { contacts: this.state.data };
		firebase.firestore().collection(global.domain).doc("config").set(docData, { merge: true }).then(() => {
			typeof callback === "function" && callback();
		});
	};

	animateList = () => {
		if (!this.active) {
			return;
		}

		requestAnimationFrame(() => {
			// check if we are near the bottom or top
			if (this.currentY + 100 > this.flatListHeight) {
				this.flatList.current.scrollToOffset({
					offset: this.scrollOffset + 10,
					animated: false
				});
			} else if (this.currentY < 100) {
				this.flatList.current.scrollToOffset({
					offset: this.scrollOffset - 10,
					animated: false
				});
			}

			// check y value see if we need to reorder
			const newIdx = this.yToIndex(this.currentY);
			if (this.currentIdx !== newIdx) {
				this.setState({
					data: immutableMove(this.state.data, this.currentIdx, newIdx),
					draggingIdx: newIdx
				});
				this.currentIdx = newIdx;
			}

			this.animateList();
		});
	};

	yToIndex = y => {
		// const value = Math.floor(
		//   (this.scrollOffset + y - this.flatlistTopOffset) / this.rowHeight
		// );

		let value = -1;
		const scroll_y = this.scrollOffset + y;
		const listLength = this.state.data.length;
		let accumulatedHeight = this.flatlistTopOffset;
		for (let i = 0; i < listLength; i++) {
			const itemHeight = this.itemsHeight[i];
			const newAccumulatedHeight = accumulatedHeight + itemHeight;
			if (scroll_y > accumulatedHeight && scroll_y < newAccumulatedHeight) {
				value = i;
				break;
			}
			accumulatedHeight = newAccumulatedHeight;
		}

		if (value < 0) {
			return 0;
		}

		if (value > this.state.data.length - 1) {
			return this.state.data.length - 1;
		}

		return value;
	};

	reset = () => {
		this.active = false;
		this.setState({ dragging: false, draggingIdx: -1 });
	};

	_renderSubTexts = subTexts => {
		if (!subTexts) return;
		return subTexts.map(subitem => <Text style={styles.feedbackHead}>{subitem}</Text>);
	};

	render() {
		const { data, dragging, draggingIdx } = this.state;
		const renderItem = ({ item, index }, noPanResponder = false) => <View onLayout={e => {
			this.rowHeight = e.nativeEvent.layout.height;
			this.itemsHeight[index] = e.nativeEvent.layout.height;
		}} style={styles.adb54b1e0af6511ea88c25dbffc760ad0}>
			<View>
				<View style={styles.roundedButton}>
					<Ionicons name={contactIconType[item.type]} size={30} color="#FFF" />
				</View>
			</View>
			<View style={styles.adb54b1e1af6511ea88c25dbffc760ad0}>
				<Text style={styles.feedbackHeader}>{item.headerText}</Text>
				<Text style={styles.feedbackHead}>
					{typeof item.headerSubTexts == "object" ? item.headerSubTexts.join("\n") : item.headerSubTexts}
				</Text>
				{item.email ? <Anchor href={"mailto:" + item.email} title={item.email} /> : null}
			</View>
			<View style={styles.adb54b1e2af6511ea88c25dbffc760ad0}>
				<TouchableHighlight onPress={() => {
					const subhead = typeof item.headerSubTexts == "object" ? item.headerSubTexts.join("\n") : item.headerSubTexts;
					this.setState({
						modalVisible: true,
						editIdx: index,
						editType: item.type,
						editPhoneNumber: item.phoneNumber,
						editEmail: item.email,
						editTitle: item.headerText,
						editSubHeader: subhead
					});
				}}>
					<Text>Edit</Text>
				</TouchableHighlight>
			</View>
			<View style={styles.adb54d8f0af6511ea88c25dbffc760ad0}>
				<View {...noPanResponder ? {} : this._panResponder.panHandlers}>
					<FontAwesome name="sort" size={28} />
				</View>
			</View>
		</View>;

		return <SafeAreaView style={styles.adminContainer}>
			<Overlay isVisible={this.state.modalVisible} windowBackgroundColor="rgba(0, 0, 0, .85)" height="auto">
				<View>
					<Text style={styles.contactText}>
						Order:{" "}
						{this.state.editIdx > -1 ? this.state.editIdx + 1 : this.state.data.length + 1}{" "}
					</Text>
					<Text style={styles.contactText}>
						Select Icon: {this.state.editType}
					</Text>
					<View style={styles.adb54d8f1af6511ea88c25dbffc760ad0}>
						<RadioButton options={options} selected={this.state.editType} selectFunc={this.setEditType} />
					</View>

					<Text style={styles.contactText}>
						Phone Number (if type is call)
            </Text>
					<TextInput onChangeText={text => this.setState({ editPhoneNumber: text })} placeholder={"Phone Number"} value={this.state.editPhoneNumber} />

					<Text style={styles.contactText}>Email (if type is mail)</Text>
					<TextInput onChangeText={text => this.setState({ editEmail: text })} placeholder={"Email"} value={this.state.editEmail} />

					<Text style={styles.contactText}>Title: </Text>
					<TextInput onChangeText={text => this.setState({ editTitle: text })} placeholder={"Title"} autoFocus value={this.state.editTitle} />

					<Text style={styles.contactText}>SubHeader Texts: </Text>
					<TextInput onChangeText={text => this.setState({ editSubHeader: text })} placeholder={"Sub Texts"} multiline value={this.state.editSubHeader} />

					<View style={styles.adb54d8f2af6511ea88c25dbffc760ad0}>
						<Button title={this.state.editIdx > -1 ? "Update" : "Add"} onPress={() => this.updateData(() => this.setState({ modalVisible: false }))} />
					</View>

					{this.state.editIdx > -1 && <View style={styles.adb550000af6511ea88c25dbffc760ad0}>
						<Button title="Delete" onPress={() => this.deleteData(() => this.setState({ modalVisible: false }))} />
					</View>}

					<View style={styles.adb550001af6511ea88c25dbffc760ad0}>
						<Button title="Close" onPress={() => this.setState({ modalVisible: false })} />
					</View>
				</View>
			</Overlay>

			<TouchableHighlight style={styles.addButton} underlayColor="#ff7043" onPress={() => {
				this.resetEditFields(() => this.setState({ modalVisible: true }));
			}}>
				<Text style={styles.adb550002af6511ea88c25dbffc760ad0}>
					+
          </Text>
			</TouchableHighlight>

			{dragging && <Animated.View style={styles.adb550003af6511ea88c25dbffc760ad0}>
				{renderItem({ item: data[draggingIdx], index: -1 }, true)}
			</Animated.View>}

			<View style={styles.adb550004af6511ea88c25dbffc760ad0}>
				<FlatList ref={this.flatList} ItemSeparatorComponent={this._flatListItemSeparator} scrollEnabled={!dragging} style={styles.adb550005af6511ea88c25dbffc760ad0} data={data} renderItem={renderItem} onScroll={e => {
					this.scrollOffset = e.nativeEvent.contentOffset.y;
				}} onLayout={e => {
					this.flatlistTopOffset = e.nativeEvent.layout.y + navHeight;
					this.flatListHeight = e.nativeEvent.layout.height;
				}} scrollEventThrottle={16} keyExtractor={item => "" + item} />
			</View>
		</SafeAreaView>;
	}
}

const styles = StyleSheet.create({
	adb53c780af6511ea88c25dbffc760ad0: {
		color: "#037AFF",
		alignSelf: "center",
		fontSize: 17,
		paddingBottom: 5,
		paddingRight: 20,
		fontWeight: "600"
	},
	adb54b1e0af6511ea88c25dbffc760ad0: {
		padding: 20,
		flexDirection: "row",
	},
	adb54b1e1af6511ea88c25dbffc760ad0: {
		flex: 1,
		paddingLeft: 10
	},
	adb54b1e2af6511ea88c25dbffc760ad0: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10
	},
	adb54d8f0af6511ea88c25dbffc760ad0: {
		alignItems: "center",
		justifyContent: "center"
	},
	adb54d8f1af6511ea88c25dbffc760ad0: {
		width: 90,
		marginTop: 8
	},
	adb54d8f2af6511ea88c25dbffc760ad0: {
		marginTop: 15
	},
	adb550000af6511ea88c25dbffc760ad0: {
		marginTop: 20
	},
	adb550001af6511ea88c25dbffc760ad0: {
		marginTop: 20
	},
	adb550002af6511ea88c25dbffc760ad0: {
		fontSize: 44,
		color: "white",
		position: "absolute",
		left: "23%",
		top: "-10%"
	},
	adb550003af6511ea88c25dbffc760ad0: {
		position: "absolute",
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "grey",
		zIndex: 2,
		width: "100%",
	},
	adb550004af6511ea88c25dbffc760ad0: {
		height: "98%",
		width: "100%",
		borderColor: "black"
	},
	adb550005af6511ea88c25dbffc760ad0: {
		width: "100%"
	},

	roundedButton: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 30,
		width: 60,
		height: 60,
		backgroundColor: "#141b4d"
	},

	feedbackHeader: {
		fontSize: 22,
		paddingBottom: 10,
		fontWeight: "600",
		color: "black"
	},
	feedbackHead: {
		opacity: 0.8,
		fontSize: 13,
		fontWeight: "bold",
		color: "black"
	},

	adminContainer: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
	},
	contactText: {
		marginTop: 12,
		fontWeight: "bold"
	}
}); 