import React from "react";
import { render } from "@testing-library/react-native";
import DomainSelection from "../DomainSelection";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("../../lib/firebase");

jest.mock("../../lib/globalState", () => ({
	useDomainsP: () => [
		JSON.stringify([
			{
				name: "Team Entrepreneur CA",
				node: "team_entrepreneur_ca",
				key: "111113948fh38hf398h4f",
			},
			{
				name: "Oakforest International",
				node: "oakforest_international_edu",
				key: "33333948fh38hf398h4f",
			},
			{
				name: "Camp Asia",
				node: "camp_asia",
				key: "4444443948fh38hf398h4f",
			},
		]),
		jest.fn(),
		true,
	],

	useCountP: () => [33, jest.fn(), true],
	useAdmin: () => [true, jest.fn(), true],
	useDomain: () => ["", jest.fn(), true],
	useDomainP: () => ["", jest.fn(), true],
	useUid: () => ["", jest.fn(), true],
	useDomainNameP: () => ["", jest.fn(), true],
	useLanguage: () => ["en", jest.fn(), true],
	useLoginP: () => [false, jest.fn(), true],
	useUidP: () => ["", jest.fn(), true],
	useDisplayNameP: () => ["", jest.fn(), true],
	useEmailP: () => ["", jest.fn(), true],
	usePhotoURL: () => ["", jest.fn(), true],
	usePhotoURLP: () => ["", jest.fn(), true],
	AuthObj: () =>
		`{"uid":"4lGCJyOuXfbG1ig7EHJOM6LPoji2","displayName":"Simon 888","email":"simoncar@gmail.com","photoURL":"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fprofile%2F064e98b6-8d3e-4764-8740-acae99f78f89?alt=media&token=ccf2ca18-dd82-49df-95ce-c2f6edadd40b"}`,
}));

test("list domains", () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, queryByText } = render(<DomainSelection navigation={navigation} />);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Create your Polo")).not.toBeNull();
	expect(queryByText("Camp Asia")).not.toBeNull();
	expect(queryByText("Oakforest International")).not.toBeNull();
	expect(queryByText("Sign In")).not.toBeNull();
	expect(queryByText("Create Account")).not.toBeNull();
});
