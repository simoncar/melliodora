import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import ChatRoomItem from '../ChatRoomItem';

const itemCore = {
	"card": false,
	"chatroom": "dLyDZVfkOZ2XDVk49jHF",
	"mostRecentMessage": "what time is the running race?",
	"title": "School Sports",
	"type": "public",
}

test('display individual chatroom list item', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, queryByText } = render(
		<ChatRoomItem
			navigation={navigation}
			title={itemCore.title}
			mostRecentMessage={itemCore.mostRecentMessage}
			chatroom={itemCore.chatroom}
			type={itemCore.type}
			card={false}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("School Sports")).not.toBeNull();
	expect(queryByText("what time is the running race?")).not.toBeNull();
	fireEvent.press(queryByText('School Sports'));
	expect(navigation.navigate).toHaveBeenCalledWith("chat",
		{
			chatroom: "dLyDZVfkOZ2XDVk49jHF",
			card: false,
			title: "School Sports",
			type: "public",
		});
});



