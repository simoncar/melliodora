import React from "react";
import { Header } from "react-navigation";
import { View, Platform } from "react-native";
import { FlingGestureHandler } from "react-native-gesture-handler";

const CustomHeader = props => {
  return (
    <View
      style={{
        height: 56,
        marginTop: Platform.OS == "ios" ? 20 : 0
      }}
    >
      <Header {...props} />
      <Text
        style={{
          height: 560,
          color: blue
        }}
      >
        Hello
      </Text>
    </View>
  );
};

export default CustomHeader;
