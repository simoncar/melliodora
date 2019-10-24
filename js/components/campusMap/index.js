import React, { Component } from "react";
import { Image, View } from "react-native";
import { Container, Content, Text } from "native-base";
import styles from "./styles";
import Analytics from "../../lib/analytics";

class campusMap extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Analytics.track("Map");
  }

  render() {
    return (
      <Container>
        <Content showsVerticalScrollIndicator showsHorizontalScrollIndicator>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={styles.heading}>Woodleigh Campus</Text>
            <Text style={styles.text}>1 Woodleigh Lane, 357684</Text>

            <Image source={require("../../../images/sais_edu_sg/map1.png")} style={styles.mapImage} />
            <Image source={require("../../../images/sais_edu_sg/map2.png")} style={styles.mapImageLegend} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={styles.heading}>Early Learning Village</Text>
            <Text style={styles.text}>3 Chuan Lane (off Lorong Chuan)</Text>
            <Text style={styles.text2}>Singapore 554350</Text>

            <Image source={require("../../../images/sais_edu_sg/map3.png")} style={styles.mapImageELV} />
            <Image source={require("../../../images/sais_edu_sg/map4.png")} style={styles.mapImageLegendELV} />
          </View>
        </Content>
      </Container>
    );
  }
}

export default campusMap;
