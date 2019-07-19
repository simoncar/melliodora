import React, { Component } from "react";
import { StyleSheet, View, Button, Text, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import I18n from "../../lib/i18n";
import firebase from "firebase";
import AttendanceStats from "./AttendanceStats";
import BookmarkPreview from "./BookmarkPreview";
import { Feather } from "@expo/vector-icons";
import AttendanceMenu from "./AttendanceMenu";

const moment = require("moment");

export default class AttendanceOverviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: I18n.t("safeguarding"),
    headerBackTitle: null,
    headerRight: (
      <View style={{ paddingRight: 7, flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.navigate("BeaconSearch")}>
          <Feather name="search" size={28} color="gray" style={{ paddingHorizontal: 8 }} />
        </TouchableOpacity>
      </View>

    )
    });



  constructor(props) {
    super(props);
    this.state = {
      countDict: [],
    };
  }
  componentWillMount() {
    //TODO: Pass in the date from a date picker
    const xdate = moment()
      .add(8, "hours")
      .format("YYYYMMDD");

    let ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beaconHistory")
      .doc(xdate);

    let historyDoc = ref
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          console.log("Document data:", doc.data());
          countData = doc.data();

          var countDict = {
            countNotPresent: countData.countNotPresent,
            countPerimeter: countData.countPerimeter,
            countEntered: countData.countEntered,
            countExited: countData.countExited,
            countOther: countData.countOther,
          };

          this.setState({
            countDict,
          });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  }

  render() {
    console.log("fffff=", this.state.countDict);
    var countDict = this.state.countDict;
    return (
      <View style={{ minHeight: "100%" }}>
        <ScrollView style={{ backgroundColor: "#f2f2f2" }}>
          <View style={{ backgroundColor: "#fff", marginVertical: 8, marginHorizontal: 4, padding: 10 }}>
            <AttendanceStats navigation={this.props.navigation} countDict={countDict} />
          </View>

          <View style={{ backgroundColor: "#fff", flex: 1, flexDirection: "column" }}>
            <View style={{ flexDirection: "row", flexShrink: 1, paddingTop: 8, paddingHorizontal: 8 }}>
              <Text style={{ fontWeight: "bold", color: "#48484a", flex: 1 }}>Recent Bookmarks</Text>

              <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("BookmarkScreen")}>
                  <Text style={{ fontSize: 12, color: "gray" }}>View All</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <BookmarkPreview navigation={this.props.navigation} />
            </View>
          </View>
          <View style={{ minHeight: 150 }}>
            <AttendanceMenu navigation={this.props.navigation} />
          </View>

          {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("BookmarkScreen")}>
            <Text>View All Bookmarks</Text>
          </TouchableOpacity> */}
          {/* </View> */}

          {/* <View style={{ flex: 1 }}>
            <Text>
              Activity Line Chart
         </Text> */}
          {/*  <LineChart
            data={{
              labels: ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM'],
              datasets: [{
                data: [20, 45, 28, 80, 99, 43, 88, 50]
              }]
            }}
            width={Dimensions.get('window').width} // from react-native
            height={300}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              decimalPlaces: 0, // optional, defaults to 2dp
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          /> 
          </View>*/}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create();
