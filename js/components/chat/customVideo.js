import PropTypes from "prop-types";
import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  Text,
  View,
  Dimensions,
  Modal,
  ImageBackground,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import ImageViewer from "react-native-image-zoom-viewer";


const { width } = Dimensions.get("window");

export default class CustomVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
   console.log("customVideo");
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
    };
    const uri = this.props.currentMessage.image;
    const images = [
      {
        // Simplest usage.
        url: uri,
        saveToLocalByLongPress: true
      }
    ];

    if (this.props.currentMessage.video) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          >
            <Modal
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => this.setModalVisible(false)}>
            
            <TouchableOpacity
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          >

              <Text  style={{ fontSize: 20, paddingLeft:10, paddingTop: 50, paddingBottom:5 }} > Close </Text>
              </TouchableOpacity>

              <ImageViewer imageUrls={images} />
            </Modal>

            <ImageBackground
              style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width, height: 200 }}
              {...{ preview, uri }}
              resizeMode={"contain"}
            >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Text>Play Button</Text>
            </View>
            </ImageBackground>

          </TouchableOpacity>
        </View>
      );
    } else return null;
  }
}

const styles = StyleSheet.create({
  container: {},
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  }
});

CustomVideo.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {}
};

CustomVideo.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style
};
