import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import _ from "lodash";
import { SettingsListItem } from "../components/SettingsListItem";
import Profile from "../components/Profile";
import { MaterialIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import { getDomains, isDomainAdmin } from "../lib/APIDomain";
import { useDomainsP, useUid, useDomainNameP, useDomain, useLanguage, useAdmin } from "../lib/globalState";

interface TProps {
	navigation: any;
}

export default function DomainSelection(props: TProps) {
	const [loading, setLoading] = useState(true);
	const [domainsList, setDomainsList] = useState([]);
	const [admin, setAdmin] = useAdmin();
	const [NOrefresh, nodeSetter, NOstate, NOisUpdated] = useDomain();
	const [, , uid] = useUid();
	const [domains, domainsSetter, domainsIsUpdated] = useDomainsP();
	const [domainName, domainNameSetter, domainNameIsUpdated] = useDomainNameP();
	const [refreshLanguage, setLanguage, language, languageIsUpdated] = useLanguage();

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
		const userIsAdmin = isDomainAdmin(uid, item.admins);
		return (
			<View>
				<SettingsListItem
					hasNavArrow={true}
					icon={
						<MaterialIcons
							name="group"
							style={userIsAdmin ? styles.imageStyleIconAdmin : styles.imageStyleIcon}
						/>
					}
					title={item.name}
					onPress={() => {
						domainNameSetter(item.name);
						userIsAdmin ? setAdmin(true) : setAdmin(false);
						nodeSetter(item.node);
					}}
					subTitle={userIsAdmin ? I18n.t("administrator") : ""}
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
		backgroundColor: "white",
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
	imageStyleIconAdmin: {
		alignSelf: "center",
		color: "green",
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

	user: {
		color: "red",
	},
	viewFlex: {
		flex: 1,
		marginTop: 10,
	},
});
