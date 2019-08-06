import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import styles from "./styles";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { isAdmin } from "../global.js";
import { Image } from "react-native-expo-image-cache";

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
    const uri = this.props.item.item.photo1;

    return (
      <View style={styles.newsContentLine}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() =>
            this.props.navigation.navigate("story", {
              eventTitle: this.props.item.item.title,
              eventDescription: this.props.item.item.description,
              eventDate: this.props.item.item.eventDate,
              eventStartTime: this.props.item.item.eventStartTime,
              eventEndTime: this.props.item.item.eventEndTime,
              order: this.props.item.item.order,
              location: this.props.item.item.location,
              photo1: this.props.item.item.photo1,
              _key: this.props.item.item._key,
              key: this.props.item.item._key,
              calendarEvents: this.props.calendarEvents,
              visible: this.props.item.item.visible,
            })
          }
        >
          <View>
            <View
              style={{
                height: 60,
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
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

              {this.props.item.item.visible != true && (
                <Text style={styles.itemTitle}>HIDDEN {this.props.item.item.title}</Text>
              )}

              <Text style={styles.itemTitle}>{this.props.item.item.title}</Text>

              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  this.props.navigation.navigate("chat", {
                    chatroom: this.props.item.item.title,
                  });
                }}
              >
                <SimpleLineIcons name="bubble" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
              </TouchableOpacity>

              <Ionicons name="ios-more" size={30} color="black" style={{ lineHeight: 60, marginRight: 15 }} />
            </View>

            <View>
              <Image style={{ width, height: 200 }} {...{ preview, uri }} resizeMode={"contain"} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ListItem;
