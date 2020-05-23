import React, { Component } from "react";
import { View, Button, Text, TouchableOpacity, Switch, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert, ImagePropTypes } from "react-native";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const IconChat = class IconChat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsLeft}>
        <View>
          <Text>Allow Chat</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            {
              this.props.handler(!this.props.showIconChat);
            }
          }}
          style={{ padding: 8 }}
        >
          <SimpleLineIcons name="bubble" size={32} color={this.props.showIconChat ? "#222" : "#CCC"} />
        </TouchableOpacity>
      </View>
    );
  }
};

const IconShare = class IconShare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsLeft}>
        <View>
          <Text>Allow Share</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            {
              this.props.handler(!this.props.showIconShare);
            }
          }}
          style={{ padding: 8 }}
        >
          <Feather name="share" size={32} color={this.props.showIconShare ? "#222" : "#CCC"} />
        </TouchableOpacity>
      </View>
    );
  }
};

class OrderOnPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsLeft}>
        <View>
          <Text>Order on Page</Text>
        </View>
        <View>
          <Input
            onChangeText={(order) => this.props.handler(order)}
            placeholder="0"
            style={styles.eventTitle}
            value={this.props.order}
            keyboardType="number-pad"
            inputContainerStyle={{ borderBottomWidth: 0 }}
            containerStyle={styles.containerStyleOrder}
          />
        </View>
      </View>
    );
  }
}

class ShowOnHomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsItem}>
        {/* {icon} */}
        <View style={styles.settingsLeft}>
          <View>
            <Text>Home Screen</Text>
          </View>

          <View>
            <Switch onValueChange={(value) => this.props.handler(value)} style={styles.switch} value={this.props.visible} />
          </View>
        </View>
      </View>
    );
  }
}

class ShowOnMoreScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsItem}>
        {/* {icon} */}
        <View style={styles.settingsLeft}>
          <View>
            <Text>More Screen</Text>
          </View>

          <View>
            <Switch onValueChange={(value) => this.props.handler(value)} style={styles.switch} value={this.props.visible} />
          </View>
        </View>
      </View>
    );
  }
}

class EventDateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_start: new Date(),
      date: new Date(),
      time_start_pretty: props.time_start_pretty,
      time_end_pretty: props.time_end_pretty,
      mode: "date",
      show: false,
    };
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date_start;
    //setShow(Platform.OS === "ios");
    console.log("update onChange", selectedDate);
    this.setState({
      date_start: selectedDate,
    });
  };

  showMode = (currentMode) => {
    console.log("showMode", currentMode);
    this.setState({
      show: true,
      mode: currentMode,
    });
  };

  showDatepicker = () => {
    this.showMode("date");
  };

  showTimepicker = () => {
    this.showMode("time");
  };

  render() {
    return (
      <View>
        <View style={styles.settingsItem}>
          <Text style={styles.settingsLeft}>Date</Text>
          <TouchableOpacity
            onPress={() => {
              if (!this.state.show == true) {
                this.showDatepicker();
              } else {
                this.setState({ show: false });
              }
            }}
          >
            <Text>{moment(this.state.date_start).format("MMMM Do YYYY")}</Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity
            onPress={() => {
              if (!this.state.show == true) {
                this.showTimepicker();
              } else {
                this.setState({ show: false });
              }
            }}
          >
            <Text>{moment(this.state.date_start).format("h:mm A")}</Text>
          </TouchableOpacity>
          <Text> - </Text>
          <TouchableOpacity
            onPress={() => {
              if (!this.state.show == true) {
                this.showTimepicker();
              } else {
                this.setState({ show: false });
              }
            }}
          >
            <Text>{moment(this.state.date_start).format("h:mm A")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({ show: false, date_start: "" });
            }}
          >
            <Text> XX</Text>
          </TouchableOpacity>
        </View>

        <View>
          {this.state.show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={this.state.date_start}
              mode={this.state.mode}
              is24Hour={true}
              display="default"
              onChange={this.onChange}
            />
          )}
        </View>
      </View>
    );
  }
}

export { IconChat, IconShare, OrderOnPage, ShowOnHomeScreen, ShowOnMoreScreen, EventDateTime };
