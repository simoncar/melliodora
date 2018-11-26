import React, { Component } from 'react'
import { StatusBar, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import { Container, Header, Title, Content, Text, Icon, Card, CardItem, Item, Body, Right, Button, Input, Form, Textarea, Left } from 'native-base'


export default class form extends Component {


  constructor(props) {
    super(props);
    this.state = {
      name: null,
      mobile: null,
      email: null,
      msg: null,
    };
  }

  postMsg = (name, mobile, email, msg, nameClear, mobileClear, emailClear, msgClear) => {
    if(this.state.msg!=null){ 
      fetch('https://calendar-app-57e88.firebaseio.com/instance/0001-sais_edu_sg/gala2018/contacts.json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name": name,
          "mobile": mobile,
          "email": email,
          "msg": msg,
        }),
      })
      .then((response) => response.json())
      .then((responseData) => {
              if(responseData.name != null ){
                this.refs[nameClear].setNativeProps({text: ''});
                this.refs[mobileClear].setNativeProps({text: ''});
                this.refs[emailClear].setNativeProps({text: ''});
                this.refs[msgClear].setNativeProps({text: ''});
                this.setState({
                    name: null,
                    mobile: null,
                    email:null,
                    msg: null,
                    isSubmited: true,
                  })              
              }
              else{
              Alert.alert(
                'Oops !',
                'Something went wrong',
                [
                  {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
            }

      })
      .done();
    }
      else{
        Alert.alert(
          'Oops !',
          'Press SUBMIT button after entering your Message.',
          [
            {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        )        
      }
    
  };

    _togglePostCard(){
        this.setState({
            isSubmited: false
        })
    }



    render() {
      return (
        <Container>
        <Header androidStatusBarColor="#1362af" style={{ backgroundColor: '#1976D2' }}>
          <Body style = {{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            <Title>CONTACT</Title>
          </Body>
        </Header>
          <Content>


            <Card style={styles.postCard}>
            {this.state.isSubmited ?
            <View>
                <CardItem>
                    <Item>
                      <Icon active name="ios-checkmark-circle" style={{fontSize: 30, color: '#4CAF50', marginLeft:5, marginRight:10}} />
                       <Text style = {{flex:1}}>Thanks. We will get in touch with you as soon as possible</Text>
                    </Item>
                </CardItem>
                <CardItem>
                    <Left>
                    </Left>
                    <Body>
                        <TouchableOpacity success onPress={() => this._togglePostCard()}>
                            <Icon active name="refresh" style={{fontSize: 40, color: '#64DD17', marginLeft:10}} />
                        </TouchableOpacity>
                    </Body>
                    <Right>
                    </Right>
                </CardItem>
            </View>
            :
            <View>
                <CardItem>
                    <Item>
                        <Input placeholder='Name' onChangeText={(name) => this.setState({name})} ref={'nameClear'}/>
                    </Item>
                </CardItem>
                <CardItem>
                    <Item>
                        <Input placeholder='Mobile' onChangeText={(mobile) => this.setState({mobile})} ref={'mobileClear'} keyboardType = {'phone-pad'}/>
                    </Item>
                </CardItem>
                <CardItem>
                    <Item>
                        <Input placeholder='Email' onChangeText={(email) => this.setState({email})} ref={'emailClear'} keyboardType = {'email-address'}/>
                    </Item>
                </CardItem>
                    <Form style = {{ marginLeft: 20, marginRight:20 }}>
                        <Textarea rowSpan={5} bordered placeholder="Type your message" onChangeText={(msg) => this.setState({msg})} ref={'msgClear'}/>
                    </Form>
                <CardItem>
                    <Left>
                    </Left>
                    <Body>
                        <Button success onPress={() => this.postMsg(this.state.name, this.state.mobile, this.state.email, this.state.msg, 'nameClear', 'mobileClear', 'emailClear', 'msgClear')}>
                        <Text>SUBMIT</Text>
                        </Button>
                    </Body>
                    <Right>
                    </Right>
                </CardItem>
            </View>
            }
            </Card>
          </Content>
        </Container>
      );
  }
}

const styles = StyleSheet.create({
  loading:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#1C97F7',
  },
  alertText: {
    fontSize:12,
    color: '#ffffff',
  },
  conCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
  },
  conCardItem: {
    marginLeft: 5,
    marginTop:5,
  },
  conDetails: {
    fontSize: 15,
    color: 'black',
    marginLeft: 5,
  },
  postCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,     
  }
});