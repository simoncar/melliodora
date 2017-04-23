

import React, { Component } from 'react';
import { View, Platform, Text } from 'react-native';
import { connect } from 'react-redux';

import { Container, Content, Icon, Card, CardItem, Thumbnail, Body, Right } from 'native-base';

import styles from './style';

class TabTwo extends Component {

  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  render() {
    return (
      <Container>
        <Content showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: '#FFF' }}>
            <Card foregroundColor="#222" style={styles.card}>
              <CardItem style={styles.cardHeader} header>
                <Thumbnail small source={require('../../../images/contacts/sanket.png')} style={Platform.OS === 'android' ? { borderRadius: 40 } : {}} />
                <Text style={styles.cmtName}>Kumar Sanket</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 0, top: 27 }}>
                  <Icon name="ios-time-outline" style={styles.timeIcon} />
                  <Text style={styles.date}>May 24, 11:00 AM</Text>
                  <Icon name="ios-heart-outline" style={styles.likeIcon} />
                  <Text style={styles.date}>12</Text>
                </View>
              </CardItem>

              <CardItem style={styles.cardItem} >
                <Text style={{ color: '#000', paddingLeft: 10 }}>
                        Life is one time offer! Use it well
                    </Text>
              </CardItem>
            </Card>


            <Card foregroundColor="#222" style={styles.card}>
              <CardItem style={styles.cardHeader} header>
                <Thumbnail small source={require('../../../images/contacts/saurav.png')} style={Platform.OS === 'android' ? { borderRadius: 40 } : {}} />
                <Text style={styles.cmtName}>Saurav Sahu</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 0, top: 27 }}>
                  <Icon name="ios-time-outline" style={styles.timeIcon} />
                  <Text style={styles.date}>Feb 17, 04:30 PM</Text>
                  <Icon name="ios-heart-outline" style={styles.likeIcon} />
                  <Text style={styles.date}>5</Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem} >
                <Text style={{ color: '#000', paddingLeft: 10 }}>
                        Failure is the stepping stone for success.
                    </Text>
              </CardItem>
            </Card>

            <Card foregroundColor="#222" style={styles.card}>
              <CardItem style={styles.cardHeader} header>
                <Thumbnail small source={require('../../../images/contacts/atul.png')} style={Platform.OS === 'android' ? { borderRadius: 40 } : {}} />
                <Text style={styles.cmtName}>Atul Ranjan</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 0, top: 27 }}>
                  <Icon name="ios-time-outline" style={styles.timeIcon} />
                  <Text style={styles.date}>Feb 03, 01:00 PM</Text>
                  <Icon name="ios-heart-outline" style={styles.likeIcon} />
                  <Text style={styles.date}>5</Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem} >
                <Text style={{ color: '#000', paddingLeft: 10 }}>
                        Difficult road always lead to a beautiful destination.
                    </Text>
              </CardItem>
            </Card>

            <Card foregroundColor="#222" style={styles.card}>
              <CardItem style={styles.cardHeader} header>
                <Thumbnail small source={require('../../../images/contacts/varun.png')} style={Platform.OS === 'android' ? { borderRadius: 40 } : {}} />
                <Text style={styles.cmtName}>Varun Sahu</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 0, top: 27 }}>
                  <Icon name="ios-time-outline" style={styles.timeIcon} />
                  <Text style={styles.date}>Jan 12, 09:30 PM</Text>
                  <Icon name="ios-heart-outline" style={styles.likeIcon} />
                  <Text style={styles.date}>4</Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem} >
                <Text style={{ color: '#000', paddingLeft: 10 }}>
                         Wish I had a Time machine.
                    </Text>
              </CardItem>
            </Card>

            <Card foregroundColor="#222" style={styles.card}>
              <CardItem style={styles.cardHeader} header>
                <Thumbnail small source={require('../../../images/contacts/sanket.png')} style={Platform.OS === 'android' ? { borderRadius: 40 } : {}} />
                <Text style={styles.cmtName}>Kumar Sanket</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 0, top: 27 }}>
                  <Icon name="ios-time-outline" style={styles.timeIcon} />
                  <Text style={styles.date}>May 24, 11:00 AM</Text>
                  <Icon name="ios-heart-outline" style={styles.likeIcon} />
                  <Text style={styles.date}>12</Text>
                </View>
              </CardItem>

              <CardItem style={styles.cardItem} >
                <Text style={{ color: '#000', paddingLeft: 10 }}>
                        Life is one time offer! Use it well
                    </Text>
              </CardItem>
            </Card>


            <Card foregroundColor="#222" style={styles.card}>
              <CardItem style={styles.cardHeader} header>
                <Thumbnail small source={require('../../../images/contacts/saurav.png')} style={Platform.OS === 'android' ? { borderRadius: 40 } : {}} />
                <Text style={styles.cmtName}>Saurav Sahu</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 0, top: 27 }}>
                  <Icon name="ios-time-outline" style={styles.timeIcon} />
                  <Text style={styles.date}>Feb 17, 04:30 PM</Text>
                  <Icon name="ios-heart-outline" style={styles.likeIcon} />
                  <Text style={styles.date}>5</Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem} >
                <Text style={{ color: '#000', paddingLeft: 10 }}>
                        Failure is the stepping stone for success.
                    </Text>
              </CardItem>
            </Card>
          </View>
        </Content>
      </Container>
    );
  }
}


const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps)(TabTwo);
