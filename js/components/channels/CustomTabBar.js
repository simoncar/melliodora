

import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';


import { Text, View } from 'native-base';


const deviceWidth = require('Dimensions').get('window').width;
const TAB_UNDERLINE_REF = 'TAB_UNDERLINE';
class CustomTabBar extends Component {
  propTypes: {
   goToPage: React.PropTypes.func,
   activeTab: React.PropTypes.number,
   tabs: React.PropTypes.array
 }
  static propTypes = {
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }
  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)} style={[styles.tab, { borderWidth: isTabActive ? 2 : 0, borderColor: isTabActive ? '#FFF' : 'transparent', borderRadius: isTabActive ? 30 : undefined }]}>
        <Text style={{ color: '#fff', fontWeight: isTabActive ? '900' : '500' }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: deviceWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };
    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  }
}


const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

const primary = require('../../themes/variable').brandPrimary;
const styles = {
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    marginHorizontal: 5,
  },

  tabs: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 10,
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
};

export default connect(mapStateToProps)(CustomTabBar);
