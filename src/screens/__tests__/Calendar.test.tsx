import React from "react";
import { render } from "@testing-library/react-native";
import Calendar from "../Calendar";

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
		domain: "oakforest_international_edu",
		language: "en",
		admin: false,
		storyKey: "gbcuwgq84df34gf738g",
	},
};

test("show calendar screen", () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON} = render(<Calendar navigation={navigation} route={route} />);

	expect(toJSON()).toMatchSnapshot();
});
