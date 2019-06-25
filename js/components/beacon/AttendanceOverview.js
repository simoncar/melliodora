import React, { Component } from 'react';
import { Platform, StyleSheet, View, Button, Text } from "react-native";

export default class AttendanceOverview extends Component {
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
              <View style={styles.widgetContent}>
                <Text style={styles.widgetTextTitle}>Students on Campus now</Text>

                <Text style={styles.widgetTextContent}>3028</Text>
              </View>
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
