import React, { Component } from "react";
import {
  View,
  Text,
  Picker,
  SafeAreaView,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableHighlight,
  Alert
} from "react-native";
import { iOSUIKit, iOSColors } from "react-native-typography";
import _ from "lodash";
import { SearchBar } from "react-native-elements";
import { connect } from 'react-redux';
import { getCommunities, processSelectedCommunity } from "../../store/community";
class DomainSelection extends Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.selectedBGWidth = new Animated.Value(0);
    this.highlightwidth = 0;
    this.state = {
      selectedDomain: "",
      domains: [],
      allDomains: []
    };

    props.dispatch(getCommunities());
  }

  componentDidMount() {

    const { communities } = this.props.community
    if (communities.length > 0) {
      this.setState({ domains: communities, allDomains: communities })
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const { communities } = this.props.community;
    if (communities !== prevProps.community.communities) {
      this.setState({ domains: communities, allDomains: communities })
    }
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  animateHighlightSelected = () => {
    this.selectedBGWidth.setValue(0);
    Animated.timing(this.selectedBGWidth, {
      toValue: 1,
      duration: 300,
      easing: Easing.in(Easing.quad)
    }).start();
  };

  searchFilterFunction = text => {
    this.setState({
      selectedDomain: null,
      searchTerm: text
    });

    const allDomains = this.state.allDomains;

    //reset when blank text
    if (!text) {
      this.setState({
        domains: allDomains
      });
      return;
    }
    const textToSearch = text.toUpperCase();
    const filteredData = allDomains.filter(dataItem => {
      const searchObject = _.pick(dataItem, ["name", "node"]);

      return Object.values(searchObject).some(item => item.toUpperCase().includes(textToSearch));
    });

    this.setState({
      domains: filteredData
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search Community"
        // ref={search => (this.search = search)}
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.searchTerm}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchContainer}
        autoCapitalize="none"
      />
    );
  };

  renderItem = ({ item }) => {
    const selected = this.state.selectedDomain == item;
    return (
      <TouchableOpacity style={styles.item}
        onLayout={
          (event) => {
            if (this.highlightwidth == 0) {
              this.highlightwidth = event.nativeEvent.layout.width;
            }
          }
        }
        onPress={
          () => {
            this.setState({ selectedDomain: item });
            this.animateHighlightSelected();
          }
        }
      >
        {
          selected ? (
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#96ceb4",
                zIndex: -2,
                width: this.selectedBGWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, this.highlightwidth]
                })
              }}></Animated.View >
          ) : null}

        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.node}</Text>
      </TouchableOpacity >
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flexDirection: "column" }}>
        <Text
          style={{
            ...iOSUIKit.largeTitleEmphasized,
            color: iOSColors.gray,
            marginTop: 58,
            marginLeft: 12,
            marginBottom: 12,
            alignSelf: "center"
          }}>
          Select Community
        </Text>

        <View
          style={{
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderWidth: 1,
            margin: 12,
            borderColor: "#e5e6eb",
            backgroundColor: "#f8f8fa",
            zIndex: 1,
            shadowColor: "rgba(0,0,0, .4)",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 1,
            elevation: 5,
            height: 340
          }}>
          {this.renderHeader()}
          <FlatList
            data={this.state.domains}
            renderItem={this.renderItem}
            keyExtractor={(_, idx) => "domain" + idx}
            ItemSeparatorComponent={this.renderSeparator}
            bounces={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Button
          title="Confirm"
          style={{ marginTop: 26 }}
          onPress={() => {
            if (!this.state.selectedDomain) {
              Alert.alert('Please select a community');
            } else {
              console.log("button presed");
              this.props.dispatch(processSelectedCommunity(this.state.selectedDomain));
            }
          }}
        />

        {
          this.props.showCreateCommunity === false ?
            null
            :
            <Button
              title="Create Community"
              style={{ marginTop: 26 }}
              onPress={() => {
                this.props.navigation.push("preWelcome")
              }}
            />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    zIndex: -1,
    overflow: "hidden"
  },
  title: {
    fontSize: 14,
    color: "#222",
    fontWeight: "bold",
    overflow: "hidden",
    zIndex: -1
  },
  subtitle: {
    fontSize: 11,
    color: "#70757a",
    overflow: "hidden",
    zIndex: -1
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderWidth: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    overflow: "hidden",
    zIndex: -1
  },
  TextStyle: {
    color: "#636366",
    textAlign: "center",
  },
});

const mapStateToProps = state => ({
  community: state.community,
});
export default connect(mapStateToProps)(DomainSelection);