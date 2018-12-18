import React from 'react';
import { Button, Image, View } from 'react-native';
import { Permissions, ImagePicker } from 'expo';

import * as firebase from "firebase";

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };


  onChooseImagePress = async () => {
    //let result = await ImagePicker.launchCameraAsync();
    let result = await ImagePicker.launchImageLibraryAsync();
  }

  uploadImage = async (uri, imageName) => {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child('images/' + imageName);
    return ref.put(blob, metadata);
  }

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  _pickImage = async () => {

    let { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    console.log('status of Camera permission: ', status);
    if (status !== 'granted') {
      console.log('Camera permission not granted!');
      console.log('Asking for permission');
      status = await Permissions.askAsync(Permissions.CAMERA_ROLL).status;
      if (status !== 'granted') {
        console.log('Asked for permission, but not granted!');
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      
    });

    if (!result.cancelled) {

      const imageName = new Date().getTime() + "-media.jpg"
      this.uploadImage(result.uri, imageName)
        .then(() => {
          console.log("GGGGGGGGGG - - - - - Success");
        })
        .catch((error) => {
          console.log(error);
        });
    }

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}