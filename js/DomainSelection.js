import React, { Component } from "react";
import { View, Text, Picker, SafeAreaView, StyleSheet, Button } from "react-native";
import { iOSUIKit, iOSColors } from 'react-native-typography'

export default class DomainSelection extends Component {
  constructor() {
    super();
    this.state = {
      selectedDomain: ""
    };

  }

  render() {
    return (
      <SafeAreaView>
        <Text style={{ ...iOSUIKit.largeTitleEmphasized, color: iOSColors.gray, marginTop: 78, marginLeft: 12, marginBottom: 12 }}>Select Community: </Text>

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
        </Picker>
        <Button
          title="Select"
          style={{ marginTop: 26 }}
          onPress={() => this.props.setSelectedDomain(this.state.selectedDomain || this.props.domains[0].node)}
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
    marginBottom: 60
  },
  pickerItem: {
    height: 100
  }
})