import React from "react";
import { View, ImageBackground, Text, TextInput, TouchableOpacity, Switch, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert } from "react-native";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export function drawIconChat(chatroom, title) {
  return (
    <TouchableOpacity
      onPress={() => {
        this.setState({ showIconChat: !this.state.showIconChat });
      }}
      style={{ padding: 8 }}
    >
      <SimpleLineIcons name="bubble" size={32} color={this.state.showIconChat ? "#222" : "#CCC"} />
    </TouchableOpacity>
  );
}
