import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Image as ReactImage } from 'react-native'
import CustomImage from '../ChatCustomImage';


jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock('../../lib/firebase')

const item = {
	_id: "7be35242-957e-4af3-aa63-881124a79ed0",
	chatroom: "dLyDZVfkOZ2XDVk49jHF",
	createdAt: "2020-06-18T05:45:30.528Z",
	image: "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/chatimage%2FdLyDZVfkOZ2XDVk49jHF%2F202006%2F73891c7b-5960-4b7f-a7e3-b8975ee9fecc?alt=media&token=f76974de-d8d2-4b1f-a980-a83265bdcf10",
	quickReplies: undefined,
	system: false,
	timestamp: "2020-06-18T05:45:30.528Z",
	user: {
		_id: "g1goqmCShIT54ZP3nKkjHZGo1hu1",
		email: undefined,
		name: "",
	},
	video: undefined,
}


test('show photo in chat thread', () => {

	const getSizeMock = jest.spyOn(ReactImage, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON, getByTestId } = render(
		<CustomImage currentMessage={item} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(getByTestId('customImage.image').props.source).toEqual(
		expect.objectContaining({
			uri: "https://smartcookies.imgix.net/chatimage%2FdLyDZVfkOZ2XDVk49jHF%2F202006%2F73891c7b-5960-4b7f-a7e3-b8975ee9fecc?alt=media&token=f76974de-d8d2-4b1f-a980-a83265bdcf10&auto=enhance&fit=clip&w=1050",
		})
	);

	fireEvent.press(getByTestId('customImage.showImage'));
	fireEvent.press(getByTestId('customImage.save'));
});




