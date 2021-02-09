import React from "react";
import { render } from "@testing-library/react-native";
import MoreAdmin from "../MoreAdmin";
import { Bar } from "expo-progress";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

jest.mock("../../lib/firebase");
jest.mock("../../lib/APIStory", () => ({
	getStories: () => jest.fn(),
}));

jest.mock("../../lib/globalState", () => ({
	useDomain: () => ["oakforest_international_edu", jest.fn(), "oakforest_international_edu"],
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

test("show moreAdmin items", () => {
	Bar.mockImplementation(() => {
		return null;
	});

	const navigation = {
		navigate: jest.fn(),
	};

	const { toJSON } = render(<MoreAdmin navigation={navigation} />);

	expect(toJSON()).toMatchSnapshot();
});
