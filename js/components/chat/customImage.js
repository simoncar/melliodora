import PropTypes from "prop-types";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  Text,
  View,
  Dimensions,
  Modal,
  Button,
  CameraRoll
} from "react-native";
import { Image } from "react-native-expo-image-cache";

const { width } = Dimensions.get("window");

export default class CustomImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      saveTitle: "Save"
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _share(uri) {
    CameraRoll.saveToCameraRoll(uri, "photo");

    this.setState({ saveTitle: "Saved" });
  }

  render() {
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

    if (this.props.currentMessage.image) {
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
              onRequestClose={() => this.setModalVisible(false)}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    paddingLeft: 10,
                    paddingTop: 50,
                    paddingBottom: 5
                  }}
                >
                  {" "}
                  Close{" "}
                </Text>
              </TouchableOpacity>
              <Image
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: null,
                  height: null
                }}
                {...{ preview, uri }}
                resizeMode={"contain"}
              />
            </Modal>

            <Image
              style={{ width, height: 200 }}
              {...{ preview, uri }}
              resizeMode={"contain"}
            />
          </TouchableOpacity>

          <Button
            title={this.state.saveTitle}
            onPress={() => {
              this._share(uri);
            }}
          />
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

CustomImage.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {}
};

CustomImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style
};
