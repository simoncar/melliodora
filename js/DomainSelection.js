import React, { Component } from "react";
import { View, Text, Picker, SafeAreaView, StyleSheet, Button } from "react-native";
import * as firebase from "firebase";
import { AppLoading } from "expo";

export default class DomainSelection extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      domains: []
    };

  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("domains")
      .get()
      .then(snapshot => {
        console.log("snapshot");
        if (snapshot.empty) {
          console.log("No notifications");
          return;
        }

        const domainsStore = [];
        snapshot.forEach(doc => {
          console.log(doc.data())
          item = doc.data();
          domainsStore.push(item);
        });
        console.log("domainsStore", domainsStore);
        this.setState({
          isReady: true,
          domains: domainsStore,
          selectedDomain: domainsStore[1].node
        });
      });
  }


  render() {
    if (!this.state.isReady) {
      console.log("....waiting....");
      return <AppLoading />;
    }
    console.log("domains", this.state.domains);
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
            this.state.domains.map(item => {
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