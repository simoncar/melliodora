import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default class RadioButtons extends Component {
    state = {
        value: null,
    };

    render() {
        const { options } = this.props;
        const { value } = this.state;

        return (
            <View>
                {options.map(item => {
                    return (
                        <View key={item} style={styles.buttonContainer}>
                            <Text>{item}</Text>
                            <TouchableOpacity
                                style={styles.circle}
                                onPress={() => {
                                    this.setState({
                                        value: item,
                                    });
                                }}
                            >
                                {value === item && <View style={styles.checkedCircle} />}
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#794F9B',
    },
});