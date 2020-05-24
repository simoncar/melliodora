import React, { Component } from "react";
import { View, Button, Text, TouchableOpacity, Switch, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert, ImagePropTypes } from "react-native";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import _ from "lodash";

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

const IconChat = class IconChat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("PROP CHAT:", this.props.showIconChat);

    return (
      <View style={styles.settingsItem}>
        <View style={styles.settingsLeft}>
          <View>
            <Text>Allow Chat</Text>
          </View>

          <View>
            <Switch onValueChange={(value) => this.props.handler(!this.props.showIconChat)} style={styles.switch} value={this.props.showIconChat} />
          </View>
        </View>
      </View>
    );
  }
};

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
      dateTimeStart: props.dateTimeStart,
      dateTimeEnd: props.dateTimeEnd,
      mode: "date",
      show: false,
    };
  }

  onChange = (event, selectedDate) => {
    //setShow(Platform.OS === "ios");
    console.log("ONCHANGEe", selectedDate);
    if (this.state.startEnd == "end") {
      this.setState({
        dateTimeEnd: selectedDate,
        controlDate: selectedDate,
      });
    } else {
      this.setState({
        dateTimeStart: selectedDate,
        controlDate: selectedDate,
      });
    }
  };

  showMode = (currentMode, startEnd) => {
    this.setState({
      show: true,
      mode: currentMode,
      startEnd: startEnd,
    });

    if (startEnd == "start") {
      this.setState({ controlDate: this.state.dateTimeStart });
    } else {
      this.setState({ controlDate: this.state.dateTimeEnd });
    }
  };

  showDatepicker = () => {
    if (!_.isDate(this.state.dateTimeStart)) this.setState({ dateTimeStart: new Date() });
    if (!_.isDate(this.state.dateTimeEnd)) this.setState({ dateTimeEnd: new Date() });

    this.showMode("date", "start");
  };

  showStartTimepicker = () => {
    if (!_.isDate(this.state.dateTimeStart)) this.setState({ dateTimeStart: new Date() });
    this.showMode("time", "start");
  };

  showEndTimepicker = () => {
    if (!_.isDate(this.state.dateTimeEnd)) this.setState({ dateTimeStart: new Date() });
    this.showMode("time", "end");
  };

  render() {
    return (
      <View style={styles.containerStyle}>
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
            <Text>{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("MMMM Do YYYY") : "Start Date "}</Text>
          </TouchableOpacity>
          <Text> </Text>

          <TouchableOpacity
            onPress={() => {
              if (!this.state.show == true) {
                this.showStartTimepicker();
              } else {
                this.setState({ show: false });
              }
            }}
          >
            <Text>{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("h:mm a") : "Time"}</Text>
          </TouchableOpacity>
          <Text> - </Text>
          <TouchableOpacity
            onPress={() => {
              if (!this.state.show == true) {
                this.showEndTimepicker();
              } else {
                this.setState({ show: false });
              }
            }}
          >
            <Text>{_.isDate(this.state.dateTimeEnd) ? moment(this.state.dateTimeEnd).format("h:mm a") : "End"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({ show: false, dateTimeStart: "", dateTimeEnd: "" });
            }}
          >
            <MaterialIcons name="clear" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View>
          {this.state.show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={_.isDate(this.state.controlDate) ? this.state.controlDate : new Date()}
              mode={this.state.mode}
              is24Hour={false}
              display="default"
              onChange={this.onChange}
            />
          )}
        </View>
      </View>
    );
  }
}

export { IconChat, OrderOnPage, ShowOnHomeScreen, ShowOnMoreScreen, EventDateTime };
