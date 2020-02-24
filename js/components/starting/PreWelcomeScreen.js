import React, { Component } from 'react'
import { Text, View, Image, Button } from 'react-native'



export default class PreWelcomeScreen extends Component {
  render() {
    return (
      <View>

        <Image
          style={{ width: "100%", height: "85%", borderBottomWidth: 1, borderColor: "#f0f0f0" }}
          resizeMode="contain"
          source={require('../../../resources/genericApp/icons/ios/AppIcon.appiconset/Icon-App.png')}
        />

        <Button
          title="Login"
          // style={{ marginTop: 26 }}
          onPress={() => {
            this.props.navigation.push("login", { toWelcomeScreen: true })
          }}
        />

        <Button
          title="Register"
          // style={{ marginTop: 500 }}
          onPress={() => {
            this.props.navigation.push("signup", { toWelcomeScreen: true })
          }}
        />
      </View>
    )
  }
}
