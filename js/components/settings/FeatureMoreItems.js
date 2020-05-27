import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { Image } from "react-native-expo-image-cache";

import firebase from "firebase";
import ListItem from "./FeatureListItem";
import { getLanguageString } from "../global";
import { SettingsListItem, Separator } from "./SettingsListItem";
import { connect } from "react-redux";

class FeatureMoreItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      featureItems: [],
    };
  }

  componentDidMount() {
    try {
      this.ref = firebase.firestore().collection(global.domain).doc("feature").collection("features").orderBy("order");
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    } catch (e) {
      console.error(e.message);
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    var trans = {};
    var featureItems = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().translated == true) {
        trans = {
          source: "feature",
          summaryMyLanguage: getLanguageString(this.props.language, doc.data(), "summary"),
          descriptionMyLanguage: getLanguageString(this.props.language, doc.data(), "description"),
        };
      } else {
        trans = {
          source: "feature",
          summaryMyLanguage: doc.data().summary,
          descriptionMyLanguage: doc.data().description,
        };
      }
      if (this.props.show == "visibleMore") {
        if (doc.data().visibleMore) {
          featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
        }
      } else {
        featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
      }
    });

    if (featureItems.length > 0) {
      this.setState({
        featureItems,
      });
    }

    this.setState({
      loading: false,
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  keyExtractor = (item) => item._key;

  _renderItem({ item }) {
    const preview = {
      uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    };
    const uri = item.photo1;

    if (!(this.props.show == "visibleMore")) {
      return <ListItem navigation={this.props.navigation} item={item} editMode={this.props.editMode} language={this.props.language} />;
    } else {
      return (
        <SettingsListItem
          key={"feature2" + item._key}
          title={item.summaryMyLanguage}
          icon={
            <Image
              style={{
                marginLeft: 15,
                alignSelf: "center",
                width: 30,
                textAlign: "center",

                height: 30,
                borderRadius: 18,
                borderWidth: 0.1,
                borderColor: "lightgray",
              }}
              {...{ preview, uri }}
            />
          }
          onPress={() => this.props.navigation.navigate("storyMore", item)}
        />
      );
    }
  }
  _listEmptyComponent = () => {
    return <View></View>;
  };
  render() {
    if (this.state.loading || !this.state.featureItems > 0) return <View></View>;
    return (
      <View>
        <Separator />

        <FlatList
          data={this.state.featureItems}
          keyExtractor={this.keyExtractor}
          renderItem={this._renderItem.bind(this)}
          scrollEnabled={false}
          ListEmptyComponent={this._listEmptyComponent}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.auth.language,
});
export default connect(mapStateToProps)(FeatureMoreItems);
