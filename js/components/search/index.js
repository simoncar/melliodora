import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, AsyncStorage } from "react-native";
import { SearchBar } from "react-native-elements";
import CalendarItem from "../calendar/CalendarItem";
import Analytics from "../../lib/analytics";

class Search extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Search",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 17
    }
  });

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: "Search...",
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

    Analytics.track("Search");

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
    console.log("callback here ");
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
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
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
    return (
      <SearchBar
        placeholder={this.state.loadingMessage}
        ref={search => (this.search = search)}
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchContainer}
      />
    );
  };

  _renderItem(item) {
    return <CalendarItem navigation={this.props.navigation} item={item.item} />;
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator
            size="large"
            style={{
              margin: 40
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
          keyExtractor={item => item.mac}
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
    flex: 1
  },
  searchContainer: {
    backgroundColor: "#fff"
  },
  navigationIcon: {
    color: "#48484A",
    fontSize: 25,
    marginRight: 10
  }
});

export default Search;
