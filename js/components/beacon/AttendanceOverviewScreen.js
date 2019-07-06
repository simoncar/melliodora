import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Divider } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";

import AttendanceStats from "./AttendanceStats";
import BookmarkPreview from "./BookmarkPreview";

export default class AttendanceOverviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("title"),
    headerBackTitle: null
  });

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ minHeight: "100%" }}>
        <ScrollView style={{ backgroundColor: "#f2f2f2" }}>
          <Text style={{ padding: 8, fontWeight: 'bold', color: '#48484a' }}>Overview</Text>
          <AttendanceStats navigation={this.props.navigation} />

          <Divider style={{ backgroundColor: "gray", margin: 12 }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ paddingLeft: 8, fontWeight: 'bold', color: '#48484a', flex: 1 }}>Recent Bookmarks</Text>

            <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 8 }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("BookmarkScreen")}>
                <Text style={{ fontSize: 12, color: 'gray' }}>View All</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={{ paddingBottom: 120 }}>
            <BookmarkPreview />
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
