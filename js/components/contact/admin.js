import React, { createRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  PanResponder,
  Animated,
  SafeAreaView,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Picker,
  TextInput
} from "react-native";
import * as firebase from "firebase";
import { Header } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import RadioButton from './RadioButton';

const contactIconType = {
  call: "ios-call",
  mail: "ios-mail",
  location: "ios-pin"
}

const options = Object.keys(contactIconType)

const navHeight = Header.HEIGHT;

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
    return (
      <Text style={styles.feedbackHead} onPress={this._handlePress}>
        {this.props.title}
      </Text>
    );
  }
}

export default class Admin extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Edit Contacts",
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.saveEditContacts();
        }}
      >
        <Text style={{
          color: "#037AFF",
          alignSelf: "center",
          fontSize: 17,
          paddingBottom: 5,
          paddingRight: 20,
          fontWeight: "600",
        }}>Save</Text>
      </TouchableOpacity>
    ),
  });

  state = {
    dragging: false,
    draggingIdx: -1,
    data: [],

    modalVisible: false,
    editIdx: -1,
    editType: "",
    editTypeAction: "",
    editTitle: "",
    editSubHeader: ""


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
        const orginPoint = gestureState.y0 - navHeight
        this.currentIdx = this.yToIndex(orginPoint);
        this.currentY = gestureState.y0;
        Animated.event([{ y: this.point.y }])({
          y: orginPoint - (this.rowHeight / 2)
        });
        this.active = true;
        this.setState({ dragging: true, draggingIdx: this.currentIdx }, () => {
          this.animateList();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentY = gestureState.moveY - navHeight
        this.currentY = currentY;
        Animated.event([{ y: this.point.y }])({ y: currentY });
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

  componentWillMount() {
    this._retrieveContactInfo();
    this.props.navigation.setParams({
      saveEditContacts: this.saveEditContacts,
    });
  }

  saveEditContacts = () => {
    const docData = { contacts: this.state.data };
    firebase
      .firestore()
      .collection(global.domain)
      .doc("config")
      .set(docData)
  }

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

  yToIndex = (y) => {
    const value = Math.floor(
      (this.scrollOffset + y - this.flatlistTopOffset) / this.rowHeight
    );

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


  _retrieveContactInfo = () => {
    try {
      console.log("stated _retrieveContactInfo");
      firebase
        .firestore()
        .collection(global.domain)
        .doc("config")
        .get()
        .then(doc => {
          if (doc.exists) {
            const docData = doc.data();
            this.setState({ data: docData.contacts });
          } else {
            console.log("No such contacts config");
          }
        });

    } catch (error) {
      // Error retrieving data
    }
  }

  _flatListItemSeparator = () => {
    return (
      <View
        style={{
          alignSelf: "center",
          height: 0.6,
          width: "80%",
          backgroundColor: "#000",
        }}
      />
    );
  }

  _renderSubTexts = (subTexts) => {
    if (!subTexts) return;
    return (subTexts.map(subitem =>
      <Text style={styles.feedbackHead}>{subitem}</Text>
    ));

  }

  render() {
    const { data, dragging, draggingIdx } = this.state;

    const renderItem = ({ item, index }, noPanResponder = false) => (
      <View

        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        style={{
          padding: 20,
          flexDirection: "row",
          opacity: draggingIdx === index ? 0 : 1
        }}
      >
        <View>
          <View style={styles.roundedButton}>
            <Ionicons name={contactIconType[item.type]} size={30} color="#FFF" />
          </View>
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={styles.feedbackHeader}>{item.headerText}</Text>
          <Text style={styles.feedbackHead}>{typeof item.headerSubTexts == "object" ? item.headerSubTexts.join("\n") : item.headerSubTexts}</Text>
          {
            item.email &&
            <Anchor href={"mailto:" + item.email} title={item.email} />
          }
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }}>
          <TouchableHighlight
            onPress={() => {
              const subhead = typeof item.headerSubTexts == "object" ? item.headerSubTexts.join("\n") : item.headerSubTexts;
              this.setState({
                modalVisible: true,
                editIdx: index,
                editType: item.type,
                editTypeAction: item.phoneNumber || item.email,
                editTitle: item.headerText,
                editSubHeader: subhead
              });
            }}>
            <Text>Edit</Text>
          </TouchableHighlight>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View {...(noPanResponder ? {} : this._panResponder.panHandlers)}>
            {/* <Text style={{ fontSize: 28 }}>@</Text> */}
            <Ionicons name="ios-move" size={28} />
          </View>
        </View>


      </View>
    );

    return (
      <SafeAreaView style={styles.adminContainer}>

        <Modal transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View
              style={{
                width: 300,
                height: "70%",
                backgroundColor: "white",
                padding: 12
              }}
            >

              <Text style={{ marginTop: 12, marginBottm: 8, fontWeight: "bold" }}>Select Type: </Text>
              <View
                style={{
                  width: 90
                }}
              >
                <RadioButton options={options} />
              </View>

              <Text style={{ marginTop: 12, marginBottm: 8, fontWeight: "bold" }}>Phone Number/Email: </Text>
              <TextInput
                onChangeText={text => this.setState({ editTypeAction: text })}
                placeholder={"Phone Number/Email"}
                value={this.state.editTypeAction}
              />

              <Text style={{ marginTop: 12, marginBottm: 8, fontWeight: "bold" }}>Title: </Text>
              <TextInput
                onChangeText={text => this.setState({ editTitle: text })}
                placeholder={"Title"}
                autoFocus
                value={this.state.editTitle}
              />

              <Text style={{ marginTop: 12, marginBottm: 8, fontWeight: "bold" }}>SubHeader Texts: </Text>
              <TextInput
                onChangeText={text => this.setState({ editSubHeader: text })}
                placeholder={"Sub Texts"}
                multiline
                value={this.state.editSubHeader}
              />

              <Button title="Close" onPress={() => this.setState({ modalVisible: false })} />
            </View>
          </View>
        </Modal>


        {dragging && (
          <Animated.View
            style={{
              position: "absolute",
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "grey",
              zIndex: 2,
              width: "100%",
              top: this.point.getLayout().top
            }}
          >
            {renderItem({ item: data[draggingIdx], index: -1 }, true)}
          </Animated.View>
        )}

        <View style={{ height: "80%", width: "100%", borderColor: "black" }}>
          <FlatList
            ref={this.flatList}
            ItemSeparatorComponent={this._flatListItemSeparator}
            scrollEnabled={!dragging}
            style={{ width: "100%" }}
            data={data}
            renderItem={renderItem}
            onScroll={e => {
              this.scrollOffset = e.nativeEvent.contentOffset.y;
            }}
            onLayout={e => {
              this.flatlistTopOffset = e.nativeEvent.layout.y;
              this.flatListHeight = e.nativeEvent.layout.height;
            }}
            scrollEventThrottle={16}
            keyExtractor={item => "" + item}
          />
        </View>

      </SafeAreaView>
    );
  }
}