import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import firebase from "../lib/firebase";
import { AntDesign } from "@expo/vector-icons";
import ChatroomItem from "../components/ChatRoomItem";
import { ShortList } from "../components/sComponent";
import { SettingsListItem } from "../components/SettingsListItem";
import { useDomain, useUid, useDisplayName, useLanguage, usePhotoURL } from "../lib/globalState";

interface TProps {
	navigation: any;
	route: any;
}

export default function ChatRooms(props: TProps) {
	const [domain] = useDomain();
	const [uid] = useUid();
	const [displayName] = useDisplayName();
	const [language, ,] = useLanguage();
	const [photoURL] = usePhotoURL();
	const [userChatrooms, setUserChatrooms] = useState([]);

	useEffect(() => {
		const unsubscribe = firebase
			.firestore()
			.collection(domain)
			.doc("chat")
			.collection("chatrooms")
			.orderBy("title")
			.onSnapshot(function (snapshot) {
				const userChatroomsArr = [];
				if (snapshot.empty) {
					return;
				}

				snapshot.forEach((doc) => {
					const item = doc.data();

					if (item.visible == false) return;

					userChatroomsArr.push({
						...item,
						chatroom: doc.id
					});
				});
				setUserChatrooms(userChatroomsArr);
			});

		return () => {
			unsubscribe();
		};
	}, []);

	const _renderItemNoCard = (navigation, item) => {
		return <ChatroomItem key={item.chatroom} {...item} navigation={navigation} card={false} domain={domain} uid={uid} displayName={displayName} language={language} photoURL={photoURL} />;
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View>
					<View style={styles.card}>
						<SettingsListItem
							hasNavArrow={true}
							icon={<AntDesign style={styles.iconLeftPlus} name="pluscircleo" />}
							title={"New Chat Group"}
							onPress={() => {
								props.navigation.navigate("ChatTitle", {
									edit: false,
									chatroom: "New Chatroom",
									title: "New Chatroom",
									domain: domain
								});
							}}
							lastItem={true}
						/>
					</View>
					<View style={styles.card}>
						<ShortList navigation={props.navigation} style={styles.card} data={userChatrooms} renderItem={_renderItemNoCard} />
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		marginBottom: 6,
		padding: 10,
		width: "95%"
	},
	container: { backgroundColor: "#EFEFF4", flex: 1, marginTop: 10 },

	iconLeftPlus: {
		color: "#999999",
		fontSize: 25,
		marginLeft: 12
	}
});
