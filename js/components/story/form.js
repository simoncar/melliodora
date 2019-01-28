import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';


const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

class NewQuote extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eventTitle: (props.edit) ? props.eventTitle : "",
            phone: (props.edit) ? props.phone : ""
        };

        this.generateID = this.generateID.bind(this);
        this.addQuote = this.addQuote.bind(this);
    }

    generateID() {
        let d = new Date().getTime();
        let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(5);
        });
        
        return id;
    }

    addQuote() {
        if (this.props.edit){
            let quote = this.props.quote;
            quote['eventTitle'] = this.state.author;
            quote['phone'] = this.state.quote;
            this.props.updateQuote(quote);
        }else{
            let id = this.generateID();
            let quote = {"id": id, "author": this.state.author, "quote": this.state.quote};
            //this.props.addQuote(quote);
        }

        Actions.pop();
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{ flex: 1, paddingTop: 50, paddingLeft: 10, paddingRight: 10 }}>
                    <TextInput
                        onChangeText={(text) => this.setState({eventTitle: text})}
                        placeholder={"Title"}
                        autoFocus={true}
                        style={[styles.title]}
                        value={this.state.eventTitle}
                    />
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => this.setState({phone: text})}
                        placeholder={"Phone"}
                        style={[styles.quote]}
                        value={this.state.phone}
                    />
                </View>
                <TouchableOpacity style={[styles.saveBtn]}
                                  disabled={(this.state.eventTitle.length > 0 && this.state.phone.length > 0) ? false : true}
                                  onPress={this.addQuote}>
                    <Text style={[styles.buttonText,
                        {
                            color: (this.state.eventTitle.length > 0 && this.state.phone.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
                        }]}>
                        Save
                    </Text>
                </TouchableOpacity>
               
            </View>
        );
    }

}

//Connect everything
export default connect(null)(NewQuote);

var styles = StyleSheet.create({
    saveBtn:{
        width: windowWidth,
        height: 44,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor:"#6B9EFA"
    },

    buttonText:{
        fontWeight: "500",
    },

    quote: {
        fontSize: 17,
        lineHeight: 38,
        fontFamily: 'Helvetica Neue',
        color: "#333333",
        padding: 16,
        paddingLeft:0,
        flex:1,
        height: 200,
        marginBottom:50,
        borderTopWidth: 1,
        borderColor: "rgba(212,211,211, 0.3)",
    },

    title: {
        fontWeight: "400",
        lineHeight: 22,
        fontSize: 16,
        fontFamily: 'Helvetica Neue',
        height:25+32,
        padding: 16,
        paddingLeft:0
    },
});