import React from "react";
import { render } from "@testing-library/react-native";
import Calendar from "../Calendar";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("../../lib/firebase");
jest.mock("../../lib/APICalendar", () => ({
	getCalendarItems: () => jest.fn(),
}));

jest.mock("../../lib/globalState", () => ({
	useDomain: () => ["oakforest_international_edu", jest.fn(), "oakforest_international_edu"],
	useLanguage: () => ["en", jest.fn(), "en"],
	AuthObj: () =>
		`{"uid":"4lGCJyOuXfbG1ig7EHJOM6LPoji2","displayName":"Simon 888","email":"simoncar@gmail.com","photoURL":"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fprofile%2F064e98b6-8d3e-4764-8740-acae99f78f89?alt=media&token=ccf2ca18-dd82-49df-95ce-c2f6edadd40b"}`,
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

	const { queryByTestId } = render(<Calendar navigation={navigation} route={route} />);

	expect(queryByTestId("native.calendar.AGENDA_CALENDAR_KNOB")).not.toBeNull();
});
