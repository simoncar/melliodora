import React, { Component } from 'react';
import { Image, View, Platform } from 'react-native';
import { connect } from 'react-redux';

import { Container, Content, Text, Icon } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import { openDrawer } from '../../actions/drawer';
import HeaderContent from './../headerContent/';

import styles from './styles';

class Timeline extends Component {

  render() {
    return (
      <Container style={styles.bg} >
        <Image source={require('../../../images/glow2.png')} style={styles.container} >
          <HeaderContent />
          <View style={styles.overviewHeaderContainer}>
            <Text style={styles.overviewHeader}>Thursday</Text>
            <Text note style={styles.overviewHead}>March 09, 2017</Text>
          </View>

          <Content showsVerticalScrollIndicator={false}>
            <View>
              <View style={styles.timelineView}>
                <View style={styles.timelineContent}>
                  <Text />
                </View>
              </View>

              <View style={styles.contentContainer}>
                <Grid>
                  <Col style={{ flexDirection: 'row' }}>
                    <Icon name="ios-bookmark" style={{ color: '#999', marginLeft: 2 }} />
                    <View style={{ paddingLeft: 27 }}>
                      <Text style={styles.timelineContentHeading}>BOOKMARKED</Text>
                    </View>
                  </Col>
                  <Col>
                    <View style={styles.newsTypeView}>
                      <Icon name="ios-time-outline" style={styles.timeIcon} />
                      <Text style={styles.time}>09:34am</Text>
                    </View>
                  </Col>
                </Grid>
              </View>
              <View style={styles.timelineView}>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTextHeader}>
                        Earth formed around 4.54 billion years ago by accretion from the solar nebula.
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={styles.timelineView}>
                <View style={styles.timelineContent}>
                  <Text />
                </View>
              </View>
              <View style={styles.contentContainer}>
                <Grid>
                        <Col style={{flexDirection: 'row' }}>
                            <Icon name='ios-chatboxes-outline' style={styles.timelineIcon} />
                            <View style={{paddingLeft: 18}}>
                                <Text style={styles.timelineContentHeading}>COMMENTED</Text>
                            </View>
                        </Col>
                        <Col>
                            <View  style={styles.newsTypeView}>
                                <Icon name='ios-time-outline' style={styles.timeIcon} />
                                <Text style={styles.time}>10:05am</Text>
                            </View>
                        </Col>
                    </Grid>
                </View>
                <View style={styles.timelineView}>
                    <View style={styles.timelineContent}>
                        <Text  style={styles.timelineTextHeader}>
                            A "giant impact" collision is thought to have been responsible for forming the Moon.
                        </Text>
                        <Text numberOfLines={2} style={styles.timelineTextComment}>
                            'The giant-impact hypothesis, sometimes called the Big Splash, or the Theia Impact.'
                        </Text>
                    </View>
                </View>
            </View>

                        <View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.contentContainer}>
                                <Grid>
                                    <Col style={{flexDirection:'row'}}>
                                        <Icon name='ios-done-all' style={styles.timelineIcon} />
                                        <View style={{paddingLeft: 30}}>
                                            <Text style={styles.timelineContentHeading}>FOLLOWED</Text>
                                        </View>
                                    </Col>
                                    <Col>
                                        <View  style={styles.newsTypeView}>
                                            <Icon name='ios-time-outline' style={styles.timeIcon} />
                                            <Text style={styles.time}>05:36pm</Text>
                                        </View>
                                    </Col>
                                </Grid>
                            </View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text  style={styles.timelineTextHeader}>'SPORTS' channel</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.contentContainer}>
                                <Grid>
                                    <Col style={{flexDirection:'row'}}>
                                        <Icon name='ios-download-outline' style={styles.timelineIcon} />
                                        <View style={{paddingLeft: 25}}>
                                            <Text style={styles.timelineContentHeading}>SHARED</Text>
                                        </View>
                                    </Col>
                                    <Col>
                                        <View  style={styles.newsTypeView}>
                                            <Icon name='ios-time-outline' style={styles.timeIcon} />
                                            <Text style={styles.time}>06:00pm</Text>
                                        </View>
                                    </Col>
                                </Grid>
                            </View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTextHeader}>
                                        Living forms derived from photosynthesis appeared between 3.2 and 2.4 billion years ago.
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.contentContainer}>
                                <Grid>
                                    <Col style={{flexDirection:'row'}}>
                                        <Icon name='ios-thumbs-up-outline' style={styles.timelineIcon} />
                                        <View style={{paddingLeft: 25}}>
                                            <Text style={styles.timelineContentHeading}>LIKED</Text>
                                        </View>
                                    </Col>
                                    <Col>
                                        <View  style={styles.newsTypeView}>
                                            <Icon name='ios-time-outline' style={styles.timeIcon} />
                                            <Text style={styles.time}>09:13pm</Text>
                                        </View>
                                    </Col>
                                </Grid>
                            </View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text  style={styles.timelineTextHeader}>
                                        Life remained mostly small and microscopic until about 580 million years ago.
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.contentContainer}>
                                <Grid>
                                    <Col style={{flexDirection:'row'}}>
                                        <Icon name='ios-copy-outline' style={styles.timelineIcon} />
                                        <View style={{paddingLeft: 25}}>
                                            <Text style={styles.timelineContentHeading}>SAVED</Text>
                                        </View>
                                    </Col>
                                    <Col>
                                        <View  style={styles.newsTypeView}>
                                            <Icon name='ios-time-outline' style={styles.timeIcon} />
                                            <Text style={styles.time}>11:03pm</Text>
                                        </View>
                                    </Col>
                                </Grid>
                            </View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text  style={styles.timelineTextHeader}>
                                        The history of Earth is divided into four great eons.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.contentContainer}>
                                <Grid>
                                    <Col style={{flexDirection:'row'}}>
                                        <Icon name='ios-archive-outline' style={styles.timelineIcon} />
                                        <View style={{paddingLeft: 25}}>
                                            <Text style={styles.timelineContentHeading}>ARCHIVED</Text>
                                        </View>
                                    </Col>
                                    <Col>
                                        <View  style={styles.newsTypeView}>
                                            <Icon name='ios-time-outline' style={styles.timeIcon} />
                                            <Text style={styles.time}>11:53pm</Text>
                                        </View>
                                    </Col>
                                </Grid>
                            </View>
                            <View style={styles.timelineView}>
                                <View style={styles.timelineContent}>
                                    <Text  style={styles.timelineTextHeader}>
                                        The Earth and Moon have the same oxygen isotopic signature.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Content>
                </Image>
            </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        openDrawer: () => dispatch(openDrawer())
    }
}

export default connect(null, bindAction)(Timeline);
