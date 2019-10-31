import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import styles from "./styles";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { getLanguageString } from "../global";

const { width } = Dimensions.get("window");

class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
    };
    const summary = getLanguageString(global.language, this.props.item.item, "summary");
    console.log("summary = ", summary);
    const showIconChat = this.props.item.item.showIconChat === false ? false : true;
    const uri = this.props.item.item.photo1;
    return (
      <View style={styles.newsContentLine}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => this.props.navigation.navigate("story", this.props.item.item)}
        >
          <View>
            <View
              style={{
                height: 60,
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width,
              }}
            >
              <Image
                style={{
                  width: 36,
                  height: 36,
                  margin: 12,
                  borderRadius: 18,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: "lightgray",
                }}
                {...{ preview, uri }}
              />
              <View>
                <Text style={styles.itemTitle}>{summary}</Text>
                <Text style={styles.itemCalendar}>{this.props.item.item.date_start}</Text>
              </View>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  this.props.navigation.navigate("chat", {
                    chatroom: this.props.item.item._key,
                    title: summary,
                  });
                }}
              >
                {showIconChat && (
                  <SimpleLineIcons name="bubble" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
                )}
              </TouchableOpacity>

              <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
            </View>
            {uri && (
              <View>
                <Image style={{ width, height: 200 }} {...{ preview, uri }} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ListItem;
