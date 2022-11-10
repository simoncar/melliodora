import React from "react";
import { render } from "@testing-library/react-native";
import SelectAlbum from "../Albums";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("../../lib/firebase");

const route = {
	params: {
		domain: "oakforest_international_edu",
		language: "en",
		admin: false,
		storyKey: "gbcuwgq84df34gf738g",
	},
};

test("show album select screen", () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId, queryByText } = render(
		<SelectAlbum navigation={navigation} albums={[]} storyKey="gbcuwgq84df34gf738g" route={route} />
	);

	expect(toJSON()).toMatchSnapshot();
});
