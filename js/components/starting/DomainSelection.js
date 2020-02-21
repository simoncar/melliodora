import React, { Component } from "react";
import { View, Text, Picker, SafeAreaView, StyleSheet, Button, FlatList, TouchableOpacity, Animated, Easing, TouchableHighlight, Alert } from "react-native";
import { iOSUIKit, iOSColors } from "react-native-typography";
import _ from "lodash";
import { SearchBar } from "react-native-elements";


export default class DomainSelection extends Component {
  constructor() {
    super();
    this.selectedBGWidth = new Animated.Value(0);
    this.highlightwidth = 0;
    this.state = {
      selectedDomain: "",
      domains: []
    };
  }

  componentDidMount() {
    console.log("this.props", this.props);
    this.setState({ domains: this.props.domains, allDomains: this.props.domains })
  }

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

  animateHighlightSelected = () => {
    this.selectedBGWidth.setValue(0);
    Animated.timing(
      this.selectedBGWidth,
      {
        toValue: 1,
        duration: 300,
        easing: Easing.in(Easing.quad)
      }
    ).start();
  }

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
      const searchObject = _.pick(dataItem, ['name', 'node']);

      return Object.values(searchObject).some(item =>
        item.toUpperCase().includes(textToSearch)
      )
    });

    this.setState({
      domains: filteredData,
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
    const { name, node } = item;
    const selected = this.state.selectedDomain == node;
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
            this.setState({ selectedDomain: node });
            this.animateHighlightSelected();
          }
        }>

        {
          selected ?
            <Animated.View style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#96ceb4",
              zIndex: -2,
              width: this.selectedBGWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, this.highlightwidth]
              }),
              // transform: [
              //   {
              //     translateX: this.selectedBGWidth.interpolate({
              //       inputRange: [0, 1],
              //       outputRange: [-1000, 0]
              //     })
              //   }
              // ]
            }}></Animated.View>
            : null
        }

        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{node}</Text>
      </TouchableOpacity>
    );
  }

  render() {

    return (
      <SafeAreaView style={{ backgroundColor: "#fff", flexDirection: "column" }}>
        <Text
          style={{
            ...iOSUIKit.largeTitleEmphasized,
            color: iOSColors.gray,
            marginTop: 58,
            marginLeft: 12,
            marginBottom: 12,
            alignSelf: "center",
          }}
        >
          Select Community
        </Text>


        <View
          style={{
            borderTopLeftRadius: 25, borderTopRightRadius: 25, borderWidth: 1, margin: 12, borderColor: "#e5e6eb", backgroundColor: "#f8f8fa", height: 340, zIndex: 1,
            shadowColor: "rgba(0,0,0, .4)",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 1,
            elevation: 5
          }}
        >
          <FlatList
            style={{ overflow: "hidden" }}
            data={this.state.domains}
            renderItem={this.renderItem}
            keyExtractor={(_, idx) => "domain" + idx}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            bounces={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponentStyle={{ overflow: "hidden" }}
            stickyHeaderIndices={[0]}
          />
        </View>

        <Button
          title="Confirm"
          style={{ marginTop: 26 }}
          onPress={() => {
            if (!this.state.selectedDomain) {
              Alert.alert('Please select a community');
            } else {
              this.props.setSelectedDomain(this.state.selectedDomain || this.props.domains[0].node)
            }
          }}
        />


        <Button
          title="Create Community"
          style={{ marginTop: 26 }}
          onPress={() => {
            this.props.navigation.push("preWelcome")
          }}
        />
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
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    overflow: "hidden",
    zIndex: -1
  },
  TextStyle: {
    color: "#636366",
    textAlign: "center",
  },
});
