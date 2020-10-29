 
import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import CalendarItem from "../components/CalendarItem";
import I18n from "../lib/i18n";
import AsyncStorage from '@react-native-community/async-storage';

class Search extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: I18n.t("search")
  });

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: I18n.t("search") + "...",
      data: [],
      fullData: [],
      error: null
    };
  }
  keyExtractor = item => item._key;

  componentDidMount() {
    // this.props.navigation.setParams({
    //   updateSearchCache: this.updateSearchCache,
    // });

    this.setState({ loading: true });
    this.loadFromAsyncStorage();
  }

  updateSearchCache = () => {
    this.setState({ loading: true });
    //Api.getStudents(this.callback.bind(this));
  };

  callback = data => {
    this.setState({ loading: false });

    this.setState({
      data: data,
      fullData: data,
      loading: false
    });
    this.search.focus();
  };

  loadFromAsyncStorage() {
    try {
      var events = [];
      AsyncStorage.getItem("calendarItems").then(fi => {
        var data = JSON.parse(fi);

        for (var key in data) {
          var calItem = data[key];
          calItem.forEach(doc => {
            events.push(doc);
          });
        }

        //if (data == null) {
        // Api.getStudents(this.callback.bind(this));
        //} else {
        this.setState({
          data: events,
          fullData: events,
          loading: false
        });
        this.search.focus();
        //  }
      });
    } catch (error) {
      console.log(error);
      // Error retrieving data
    }
  }

  // callback() {
  //   console.log("callback");
  //   this.setState({
  //     loadingMessage: "Search ...",
  //   });

  //   this.search.focus();
  // }

  renderSeparator = () => {
    return <View style={styles.abac50b50b68611ea999f193302967c6e} />;
  };

  searchFilterFunction = text => {
    this.setState({
      value: text
    });
    if (this.state.fullData != null) {
      const newData = this.state.fullData.filter(item => {
        const itemData = `${item.summary.toUpperCase()}`;
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        data: newData
      });
    }
  };

  renderHeader = () => {
    return <SearchBar placeholder={this.state.loadingMessage} ref={search => this.search = search} lightTheme round onChangeText={text => this.searchFilterFunction(text)} autoCorrect={false} value={this.state.value} containerStyle={styles.searchContainer} inputContainerStyle={styles.searchContainer} />;
  };

  _renderItem(item) {
    return <CalendarItem navigation={this.props.navigation} item={item.item} />;
  }

  render() {
    if (this.state.loading) {
      return <View style={styles.abac53260b68611ea999f193302967c6e}>
					<ActivityIndicator size="large" style={styles.abac53261b68611ea999f193302967c6e} />
				</View>;
    }
    return <View style={styles.abac53262b68611ea999f193302967c6e}>
				<FlatList data={this.state.data} renderItem={this._renderItem.bind(this)} keyExtractor={item => item.mac} ItemSeparatorComponent={this.renderSeparator} ListHeaderComponent={this.renderHeader} />
			</View>;
  }
}

// Styles
const styles = StyleSheet.create({
  abac50b50b68611ea999f193302967c6e: {
    backgroundColor: "#CED0CE",
    height: 1,
    marginLeft: "14%",
    width: "86%"
  },
  abac53260b68611ea999f193302967c6e: { alignItems: "center", flex: 1, justifyContent: "center" },
  abac53261b68611ea999f193302967c6e: {
    margin: 40
  },
  abac53262b68611ea999f193302967c6e: { flex: 1 },

  searchContainer: {
    backgroundColor: "#fff"
  },

});


export default Search;