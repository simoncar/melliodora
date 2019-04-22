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
  Dimensions
} from "react-native";
import { Image } from "react-native-expo-image-cache";


const { width } = Dimensions.get('window');

export default class CustomImage extends React.Component {
  render() {
    const preview = {
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII="
    };
    const uri = this.props.currentMessage.image;

    if (this.props.currentMessage.image) {
      return (
        <View>

          <Image
            style={{ width, height: 200 }}
            {...{ preview, uri }}
            resizeMode={"contain"}
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
