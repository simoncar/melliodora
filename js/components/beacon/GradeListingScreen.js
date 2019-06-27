import React, { Component } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { ListItem, SearchBar, Text } from 'react-native-elements';

export default class GradeListingScreen extends Component {
    static navigationOptions = {
        title: 'On Campus',
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            campusData: [
                { gradeLevel: "Grade 1", amount: 234 },
                { gradeLevel: "Grade 2", amount: 344 },
                { gradeLevel: "Grade 3", amount: 234 },
                { gradeLevel: "Grade 4", amount: 123 },
                { gradeLevel: "Grade 5", amount: 124 }
            ]
        };
    }
    _keyExtractor = (item, index) => index.toString();

    _renderItem = ({ item }) => (
        <ListItem
            title={item.gradeLevel}
            chevron={true}
            rightIcon={{ name: 'person' }}
            badge={{ value: item.amount, textStyle: { color: 'white', fontSize: 16 }, badgeStyle: { backgroundColor: 'black', minWidth: 50, minHeight: 25, borderRadius: 50, paddingHorizontal: 5 } }}
        />
    );

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE'
                }}
            />
        );
    };

    render() {


        return (
            <View>
                <FlatList
                    data={this.state.campusData}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({})
