import React from "react";
import { render } from "@testing-library/react-native";
import Settings from "../More";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("../../lib/firebase");
jest.mock("../../lib/APICalendar", () => ({
	getCalendarItems: () => jest.fn(),
}));

jest.mock("../../lib/globalState", () => ({
	useDomainP: () => ["oakforest_international_edu", jest.fn(), "oakforest_international_edu"],
	useDomainNameP: () => ["Oakforest International", jest.fn(), "Oakforest International"],
	useLanguage: () => ["en", jest.fn(), "en"],
	useLogin: () => [true, jest.fn(), true],
	useLoginP: () => [true, jest.fn(), true],
	useAdmin: () => [true, jest.fn(), true],
	useUidP: () => ["123456df34gf738g", jest.fn(), "123456df34gf738g"],
	useDisplayNameP: () => ["Some Name", jest.fn(), "Some Name"],
	useEmailP: () => ["someeamil@simon.io", jest.fn(), "someeamil@simon.io"],
	usePhotoURL: () => ["https://somephoto.jpg", jest.fn(), "https://somephoto.jpg"],
	useAuth: () => [
		`{"uid":"4lGCJyOuXfbG1ig7EHJOM6LPoji2","displayName":"Simon 888","email":"simoncar@gmail.com","photoURL":"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fprofile%2F064e98b6-8d3e-4764-8740-acae99f78f89?alt=media&token=ccf2ca18-dd82-49df-95ce-c2f6edadd40b"}`,
		jest.fn(),
		`{"uid":"4lGCJyOuXfbG1ig7EHJOM6LPoji2","displayName":"Simon 888","email":"simoncar@gmail.com","photoURL":"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fprofile%2F064e98b6-8d3e-4764-8740-acae99f78f89?alt=media&token=ccf2ca18-dd82-49df-95ce-c2f6edadd40b"}`,
	],
	AuthObj: () =>
		`{
		"uid":"4lGCJyOuXfbG1ig7EHJOM6LPoji2",
		"displayName":"Simon 888",
		"email":"simoncar@gmail.com",
		"photoURL":"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fprofile%2F064e98b6-8d3e-4764-8740-acae99f78f89?alt=media&token=ccf2ca18-dd82-49df-95ce-c2f6edadd40b",
		"language":"en",
	}`,
}));

const route = {
	params: {
		chatroom: "Test Chatroom",
		title: "Test Title",
		domain: "oakforest_international_edu",
		language: "en",
		storyKey: "123456df34gf738g",
	},
};

test("show more screen", () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn(),
	};

	const { toJSON } = render(<Settings navigation={navigation} route={route} />);

	expect(toJSON()).toMatchSnapshot();
});
