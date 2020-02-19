import React, { Component } from "react";
import { View, Text, Picker, SafeAreaView, StyleSheet, Button, FlatList, TouchableWithoutFeedback, Alert } from "react-native";
import { iOSUIKit, iOSColors } from "react-native-typography";
import _ from "lodash";
import { SearchBar } from "react-native-elements";
import { State, TapGestureHandler, LongPressGestureHandler } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";

const {
  cond,
  eq,
  set,
  neq,
  and,
  Value,
  event,
  Clock,
  startClock,
  stopClock,
  timing,
  block,
  interpolate,
  Extrapolate,
  greaterOrEq,
  or,
  call
} = Animated;


export default class Example extends Component {
  onStateChange = event([
    {
      nativeEvent: { state: this.gestureState },
    },
  ]);

  gestureState = [];
  opacity = [];
  selectedIndex = -1;
  state = {
    width: 0,
    height: 0,
    selectedDomain: "",
    domains: []
  }

  runOpacityTimer = (clock, gestureState, idx) => {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };

    const config = {
      duration: 120,
      toValue: new Value(-1),
      easing: Easing.inOut(Easing.ease),
    };


    const myCond = or(eq(gestureState, State.FAILED), eq(gestureState, State.CANCELLED), eq(gestureState, State.UNDETERMINED))
    return block([
      cond(and(eq(gestureState, State.BEGAN), neq(config.toValue, 1)), [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.frameTime, 0),
        set(config.toValue, 1),
        startClock(clock),
      ]),
      cond(and(myCond, neq(config.toValue, 0)), [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.frameTime, 0),
        set(config.toValue, 0),
        startClock(clock),
      ]),
      timing(clock, state, config),
      cond(and(eq(state.position, 1), eq(config.toValue, 1), eq(state.finished, 1)),
        [
          ...this.gestureState.map((item, i) => set(this.gestureState[i], State.CANCELLED)),
          call([], () => {
            if (this.selectedIndex != idx) {
              console.log(Number(gestureState), "sds");
              this.selectedIndex = idx;
            }
          })
        ]
      ),
      cond(state.finished, stopClock(clock)),
      interpolate(state.position, {
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    ]);
  };

  componentDidMount() {
    this.setState({ domains: this.props.domains, allDomains: this.props.domains })
    for (let idx in this.props.domains) {
      this.gestureState.push(new Value(-1));
    }

    for (let idx in this.gestureState) {
      this.opacity.push(this.runOpacityTimer(new Clock(), this.gestureState[idx], idx));
    }
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

  renderItem = ({ item, index }) => {
    const { name, node } = item;
    const selected = this.state.selectedDomain == node;
    return (
      <View>
        <LongPressGestureHandler minDist={0}
          minDurationMs={80}
          onHandlerStateChange={event([
            {
              nativeEvent: { state: this.gestureState[index] }
            },
          ])}
        >

          <Animated.View style={styles.item}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              if (this.state.width == 0 || this.state.height == 0) {
                this.setState({ width, height })
              }
            }}>
            <View>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.subtitle}>{node}</Text>
            </View>
          </Animated.View>
        </LongPressGestureHandler>

        {/* <Animated.View
          style={
            {
              width: this.state.width,
              height: this.state.height,
              borderRadius: interpolate(this.opacity[index], {
                inputRange: [0, 0.9, 1],
                outputRange: [this.state.width / 2, this.state.width / 2, 0],
                extrapolate: Extrapolate.CLAMP,
              }),
              backgroundColor: "grey",
              opacity: interpolate(this.opacity[index], {
                inputRange: [0, 1],
                outputRange: [0, 0.2],
                extrapolate: Extrapolate.CLAMP,
              }),
              transform: [{ scaleX: this.opacity[index] }, { scaleY: this.opacity[index] }],
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "hidden"
            }
          }
        /> */}

        <Animated.View style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#96ceb4",
          zIndex: -2,
          width: interpolate(this.opacity[index], {
            inputRange: [0, 1],
            outputRange: [0, this.state.width]
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
      </View>
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
          title="Select"
          style={{ marginTop: 26 }}
          onPress={() => {
            console.log("selected index", this.selectedIndex);
            if (!this.selectedIndex || this.selectedIndex < 0) {
              Alert.alert('Please select a community');
            } else {
              this.props.setSelectedDomain(this.props.domains[this.selectedIndex].node)
            }
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
  }
});