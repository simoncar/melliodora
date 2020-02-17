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

        <FlatList
          style={{ borderRadius: 25, borderWidth: 1, margin: 12, borderColor: "#e5e6eb", backgroundColor: "#f8f8fa", height: 340, }}
          data={this.state.domains}
          renderItem={this.renderItem}
          keyExtractor={(_, idx) => "domain" + idx}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          bounces={false}
        />
        <Button
          title="Select"
          style={{ marginTop: 26 }}
          onPress={() => {
            if (!this.state.selectedDomain) {
              Alert.alert('Please select a community');
            } else {
              this.props.setSelectedDomain(this.state.selectedDomain || this.props.domains[0].node)
            }
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    // flex: 1,
    width: "100%",
    height: 300,
    marginBottom: 30,
  },
  item: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    color: "#222",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 11,
    color: "#70757a"
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderWidth: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  }
});
