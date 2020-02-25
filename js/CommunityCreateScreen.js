import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux';

class CommunityCreateScreen extends Component {
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
                <Text></Text>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    communityCreate: state.communityCreate,
});
export default connect(mapStateToProps)(CommunityCreateScreen);