import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Image from "../components/Imgix"
import { SettingsListItem } from "./SettingsListItem";
import { getStories } from "../lib/storyAPI"
import { connect } from "react-redux";

const globalAny: any = global;

interface TProps {
	navigation: any,
	language: string,
}
interface TState {
	loading: boolean,
	featureItems: {
		source: string,
		summaryMyLanguage: string,
		descriptionMyLanguage: string,
		_key: string;
	}[]
}

class FeatureMoreItems extends Component<TProps, TState> {
	constructor(props: {} | Readonly<{}>) {
		super(props);

		this.state = {
			loading: true,
			featureItems: []
		};
	}

	componentDidMount() {
		try {
			getStories(globalAny.domain)
				.then(stories => {
					this.setState({
						featureItems: stories,
						loading: false
					});
				})

		} catch (e) {
			console.error(e.message);
		}
	}


	keyExtractor = (item: { _key: any; }) => item._key;

	_renderItem(item: any) {

		const uri = item.photo1;

		return <SettingsListItem
			key={"feature2" + item._key}
			title={item.summaryMyLanguage}
			icon={<Image style={styles.imageIcon}
				source={{ uri: uri }} />}
			onPress={() => this.props.navigation.navigate("storyMore", { story: item })}
		/>;
	}
	_listEmptyComponent = () => {
		return null;
	};

	render() {
		if (this.state.loading) {
			return <View><Text>Loading</Text></View>;
		} else if (this.state.featureItems === undefined || this.state.featureItems.length == 0) {
			return <View><Text>Empty</Text></View>;
		}
		else {
			return <View>
				{this.state.featureItems.map(item => {
					return <View key={item._key}>{this._renderItem(item)}</View>
				})}
			</View >
		}
	}
}

const styles = StyleSheet.create({
	imageIcon: {
		alignSelf: "center",
		borderColor: "lightgray",
		borderRadius: 18,
		borderWidth: 0.1,
		height: 30,
		marginLeft: 15,
		width: 30
	}
});

const mapStateToProps = (state: { auth: { language: any; }; }) => ({
	language: state.auth.language
});

export default connect(mapStateToProps)(FeatureMoreItems);