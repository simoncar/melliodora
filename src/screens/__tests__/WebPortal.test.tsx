import React from "react";
import { render } from "@testing-library/react-native";

import WebPortal from "../WebPortal";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("../../lib/firebase");

const itemCore = {
	params: {
		title: "Google",
		url: "https://www.google.com"
	}
};

test("web portal", () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn()
	};

	const { toJSON, getByTestId } = render(<WebPortal route={itemCore} navigation={navigation} />);

	expect(toJSON()).toMatchSnapshot();

	expect(getByTestId("webPortal.urlField").props).toEqual(
		expect.objectContaining({
			value: "https://www.google.com"
		})
	);

	expect(getByTestId("webPortal.RNCWebView").props).toEqual(
		expect.objectContaining({
			source: { uri: "https://www.google.com" }
		})
	);
});
