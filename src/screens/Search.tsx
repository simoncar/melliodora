 
import React, { useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import CalendarItem from "../components/CalendarItem";
import I18n from "../lib/i18n";

interface IProps
{
	navigation: any;
}

export default function Search(props: IProps)
{
	
  useEffect(() => {
    this.state = {
      loading: true,
      loadingMessage: I18n.t("search") + "...",
      data: [],
      fullData: [],
      error: null
    };
  }, []);
	
  const callback = data => {
    this.setState({ loading: false });

    this.setState({
      data: data,
      fullData: data,
      loading: false
    });
    this.search.focus();
  };

  const renderSeparator = () => {
    return <View style={styles.abac50b50b68611ea999f193302967c6e} />;
  };

  const searchFilterFunction = text => {
    setState({
      value: text
    });
    if (fullData != null) {
      const newData = fullData.filter(item => {
        const itemData = `${item.summary.toUpperCase()}`;
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        data: newData
      });
    }
  };

  const renderHeader = () => {
	  return <SearchBar placeholder={loadingMessage} ref={search => search = search} lightTheme round
		  onChangeText={text => searchFilterFunction(text)}
		  autoCorrect={false}
		  value={value}
		  containerStyle={styles.searchContainer}
		  inputContainerStyle={styles.searchContainer}
	  />;
  };

  const renderItem = (item) => {
    return <CalendarItem navigation={props.navigation} item={item.item} />;
  }

  
    return <View style={styles.abac53262b68611ea999f193302967c6e}>
		<FlatList
			data={data}
			renderItem={renderItem}
			keyExtractor={item => item.mac}
			ItemSeparatorComponent={renderSeparator}
			ListHeaderComponent={renderHeader} />
			</View>;
  }

// Styles
const styles = StyleSheet.create({
  abac50b50b68611ea999f193302967c6e: {
    backgroundColor: "#CED0CE",
    height: 1,
    marginLeft: "14%",
    width: "86%"
  },

  abac53262b68611ea999f193302967c6e: { flex: 1 },

  searchContainer: {
    backgroundColor: "#fff"
  },

});

