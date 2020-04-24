import React, { Component } from "react";
import { View, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, AsyncStorage } from "react-native";
import { SearchBar } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import { Text } from "native-base";
import * as firebase from "firebase";
import _ from "lodash";
import I18n from "../../lib/i18n";

class UserSearch extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "User Profiles",
    headerBackTitle: null,
    headerRight: (
      <TouchableOpacity onPress={() => navigation.state.params.reload()}>
        <View style={styles.navigationIcon}>
          <AntDesign name="reload1" style={styles.navigationIcon} />
        </View>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: I18n.t("search") + "...",
      data: [],
      fullData: [],
      error: null,
    };
  }
  keyExtractor = (item) => item._key;

  componentDidMount() {
    // this.props.navigation.state.params.reload = this.loadData;

    this.props.navigation.setParams({ reload: this.loadData });
    this.loadData();
  }

  loadData = () => {
    this.setState({ loading: true });
    this._getUsers().then((data) => this.setState({ data: data, fullData: data, loading: false }));
  };

  _getUsers = async () => {
    var data = [];
    var querySnapshot = await firebase.firestore().collection(global.domain).doc("user").collection("registered").limit(5000).get();

    querySnapshot.docs.forEach((doc) => {
      let docData = doc.data();
      docData = { ...docData, uid: docData.uid || doc.id };
      data.push(docData);
    });
    return data;
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  searchFilterFunction = (text) => {
    this.setState({
      value: text,
    });

    const fullData = this.state.fullData;

    //reset when blank text
    if (!text) {
      this.setState({
        data: fullData,
      });
      return;
    }
    const textToSearch = text.toUpperCase();
    const filteredData = fullData.filter((dataItem) => {
      const searchObject = _.pick(dataItem, ["email", "displayName", "firstName", "lastName"]);

      return Object.values(searchObject).some((item) => item.toUpperCase().includes(textToSearch));
    });

    this.setState({
      data: filteredData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder={this.state.loadingMessage}
        // ref={search => (this.search = search)}
        lightTheme
        round
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchContainer}
      />
    );
  };

  _renderItem({ item, index }) {
    console.log("item2222", item);
    const avatarTitle = item.email.slice(0, 2);
    const fullName = item.firstName + " " + item.lastName;
    const avatar = item.photoURL ? { source: { uri: item.photoURL } } : { title: avatarTitle };
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("UserProfile", { uid: item.uid, user: item })}>
        <ListItem
          leftAvatar={{
            rounded: true,
            ...avatar,
          }}
          title={
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ flex: 1, fontSize: 16 }}>{item.displayName || fullName || item.email}</Text>
            </View>
          }
          chevron={true}
          subtitle={
            <View style={{ flex: 1, flexDirection: "column", paddingTop: 3 }}>
              <Text style={{ color: "gray" }}>{fullName}</Text>
              <Text style={{ color: "gray" }}>{item.email}</Text>
            </View>
          }
        />
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator
            size="large"
            style={{
              margin: 40,
            }}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={(_, idx) => "search" + idx}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: "#fff",
  },
  navigationIcon: {
    color: "#48484A",
    fontSize: 25,
    marginRight: 10,
  },
});

export default UserSearch;
