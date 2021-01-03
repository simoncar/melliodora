import React from "react";
import { render } from "@testing-library/react-native";
import Chat from "../Chat";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("../../lib/firebase");
jest.mock("../../lib/APICalendar", () => ({
	getCalendarItems: () => jest.fn(),
}));

jest.mock("../../lib/globalState", () => ({
	useDomain: () => ["oakforest_international_edu", jest.fn(), "oakforest_international_edu"],
	useLanguage: () => ["en", jest.fn(), "en"],
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

test("show album select screen", () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn(),
	};

	const { toJSON } = render(<Chat navigation={navigation} route={route} />);

	expect(toJSON()).toMatchSnapshot();
});
