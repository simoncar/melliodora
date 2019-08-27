import React, { Component } from "react";
import { View, Text, Picker } from "react-native";

export default class DomainSelection extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }


  render() {
    // if (!this.state.isReady) {
    //   console.log("....waiting....");
    //   return <AppLoading />;
    // }
    console.log("DomainSelection", DomainSelection);
    return (
      <View>
        <Text>Select Domain</Text>

        <Picker
          selectedValue={this.state.language}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) =>
            this.props.setSelectedDomain(itemValue)
          }>

          <Picker.Item label="SAIS" value="sais_edu_sg" />
          <Picker.Item label="AIS" value="ais_edu_sg" />
        </Picker>

      </View>
    );
  }
}