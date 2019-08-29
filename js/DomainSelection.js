import React, { Component } from "react";
import { View, Text, Picker, SafeAreaView, StyleSheet, Button } from "react-native";
import * as firebase from "firebase";
import { AppLoading } from "expo";

export default class DomainSelection extends Component {
  constructor() {
    super();
    this.state = {
      selectedDomain: ""
    };

  }


  render() {

    console.log("domains", this.props.domains);
    return (
      <SafeAreaView>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>Select School: </Text>

        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedDomain}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ selectedDomain: itemValue })
          }
        >
          {
            this.props.domains.map(item => {
              return <Picker.Item label={item.name} value={item.node} />
            })
          }
          {/* <Picker.Item label="SAIS" value="sais_edu_sg" /> */}
        </Picker>
        <Button
          title="Submit"
          style={{ marginTop: 20 }}
          onPress={() => this.props.setSelectedDomain(this.state.selectedDomain)}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    // flex: 1,
    width: "100%",
    height: 44,
    marginBottom: 40
  },
  pickerItem: {
    height: 92
  }
})