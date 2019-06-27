import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Dimensions, TouchableOpacity } from "react-native";

import { LineChart } from 'react-native-chart-kit';

export default class AttendanceOverviewScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.stats}>


          <View style={styles.statsCol}>

            <View style={[styles.widget, { backgroundColor: '#0074D9' }]}>

              <View style={styles.widgetContent}>
                <Text style={styles.widgetTextTitle}>Total Students</Text>

                <Text style={styles.widgetTextContent}>3210</Text>
              </View>
            </View>


            <View style={[styles.widget, { backgroundColor: 'olivedrab' }]}>
              <TouchableOpacity style={styles.widgetContent} onPress={() => this.props.navigation.navigate("GradeListingScreen")}>
                <Text style={styles.widgetTextTitle}>Students on Campus now</Text>
                <Text style={styles.widgetTextContent}>3028</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.statsCol}>

            <View style={[styles.widget, { backgroundColor: 'darkorchid' }]}>

              <View style={styles.widgetContent}>
                <Text style={styles.widgetTextTitle}>Entered</Text>

                <Text style={styles.widgetTextContent}>3055</Text>
              </View>
            </View>

            <View style={[styles.widget, { backgroundColor: '#FF4136' }]}>

              <View style={styles.widgetContent}>
                <Text style={styles.widgetTextTitle}>Entered then Exited</Text>
                <Text style={styles.widgetTextContent}>27</Text>
              </View>
            </View>

            <View style={[styles.widget, { backgroundColor: 'tomato' }]}>

              <View style={styles.widgetContent}>
                <Text style={styles.widgetTextTitle}>No Show</Text>
                <Text style={styles.widgetTextContent}>155</Text>
              </View>
            </View>

          </View>

        </View>

        <View>
          <Text>
            Activity Line Chart
         </Text>
          <LineChart
            data={{
              labels: ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM'],
              datasets: [{
                data: [ 20, 45, 28, 80, 99, 43, 88, 50 ]
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
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#d3d3d3'
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 350
  },
  statsCol: {
    flex: 1,
    flexDirection: 'column',
  },
  widget: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    margin: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2
  },


  widgetTextTitle: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#DDDDDD'
  },
  widgetTextContent: {
    fontSize: 44,
    textAlign: 'center',
    color: '#333'
  }


});
