import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TextInput, Text } from "react-native";
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { getCommunities, processSelectedCommunity } from "../store/community";
import { SettingsListItem } from "../components/SettingsListItem";
import Profile from "../components/Profile";
import { MaterialIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import { getDomains } from "../lib/APIDomain";
import { useDomainsP, useDomainP, useDomainNameP, useDomain, useDomainName } from "../lib/globalState";

interface TProps {
	navigation: any;
}

export default function DomainSelection(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [domainsList, setDomainsList] = useState([]);
	const [NOrefresh, nodeSetter, NOstate, NOisUpdated] = useDomain();

	const [domains, domainsSetter, domainsIsUpdated] = useDomainsP();
	const [domain, domainSetter, domainIsUpdated] = useDomainP();
	const [domainName, domainNameSetter, domainNameIsUpdated] = useDomainNameP();

	useEffect(() => {
		getDomains().then((domainsDB) => {
			domainsSetter(JSON.stringify(domainsDB));
			setDomainsList(domainsDB);
		});
	}, []);

	useEffect(() => {
		if (domains !== "" && loading === true) {
			setDomainsList(JSON.parse(domains));
			setLoading(false);
		}
	}, [domains]);

	const renderSeparator = () => {
		return <View style={styles.separator} />;
	};

	const renderItem = ({ item }) => {
		return (
			<View>
				<SettingsListItem
					hasNavArrow={true}
					icon={<MaterialIcons name="group" style={styles.imageStyleIcon} />}
					title={item.name}
					onPress={() => {
						domainNameSetter(item.name);
						nodeSetter(item.node);
					}}
				/>
			</View>
		);
	};

	let onPressedCreateCommunity = () => props.navigation.push("login");

	return (
		<View style={styles.viewFlex}>
			<View>
				<View style={styles.card}>
					<Profile auth={props.auth} navigation={props.navigation} />
				</View>
				<View style={styles.card}>
					<SettingsListItem
						hasNavArrow={true}
						icon={<MaterialIcons name="camera-roll" style={styles.imageStyleIconCreate} />}
						title={I18n.t("createDomain")}
						onPress={() => onPressedCreateCommunity()}
						lastItem={true}
						subTitle="A Polo is your own space for sharing photos"
					/>
				</View>
			</View>
			{loading === false && (
				<View style={styles.card}>
					<Text>Domain_Node:{domain}</Text>
					<Text>Domain_Name:{domainName}</Text>
					<FlatList
						data={domainsList}
						renderItem={renderItem}
						keyExtractor={(item) => item._key}
						ItemSeparatorComponent={renderSeparator}
						ListFooterComponent={<View style={styles.bottomSpace}></View>}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	bottomSpace: {
		paddingBottom: 100,
	},

	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 12,
		padding: 10,
		width: "95%",
	},

	imageStyleIcon: {
		alignSelf: "center",
		color: "#999999",
		fontSize: 25,
		marginLeft: 15,
		textAlign: "center",
		width: 30,
	},

	imageStyleIconCreate: {
		alignSelf: "center",
		color: "green",
		fontSize: 25,
		marginLeft: 15,
		textAlign: "center",
		width: 30,
	},

	separator: {
		backgroundColor: "#CED0CE",
	},
	viewFlex: {
		flex: 1,
		marginTop: 10,
	},
});
