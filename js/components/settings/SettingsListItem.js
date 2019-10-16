import React, { Component } from 'react'
import { Text, View, TouchableHighlight, TextInput, Switch } from 'react-native'
import { Feather } from '@expo/vector-icons';

export default class SettingsListItem extends Component {
  _itemEditableBlock(item, index, position) {

    return ([
      <Text
        key={'itemTitle_' + index}
        style={[
          item.titleStyle ? item.titleStyle : this.props.defaultTitleStyle,
          position === 'Bottom' ? null : styles.titleText
        ]}>
        {item.title}
      </Text>,
      item.isEditable ?
        <TextInput
          key={item.id}
          style={item.editableTextStyle ? item.editableTextStyle : styles.editableText}
          placeholder={item.placeholder}
          onChangeText={(text) => item.onTextChange(text)}
          value={item.value} />
        : null
    ])
  }

  render() {
    const { icon, onPress, key, title, titleInfoStyle, titleInfo, hasNavArrow = true } = this.props
    return (
      <TouchableHighlight onPress={onPress}>
        <View style={{ flexDirection: 'row', backgroundColor: "white", paddingVertical: 8, alignItems: "center", borderBottomColor: "#CED0CE", borderBottomWidth: 1 }}>
          {icon}
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 8 }}>
            <View>
              <Text style={[titleInfoStyle, { color: "black" }]}>{title || ""}</Text>
            </View>

            <View>
              <Text style={[titleInfoStyle, { color: "grey" }]}>{titleInfo || ""}</Text>
            </View>

          </View>

          <View style={{ marginHorizontal: 8 }}>
            {
              hasNavArrow &&
              <Feather name="chevron-right" size={22} color="grey" />
            }
          </View>

        </View>
      </TouchableHighlight>
    )
  }
}