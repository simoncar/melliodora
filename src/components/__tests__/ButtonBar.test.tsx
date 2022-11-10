import React from "react";
import { render, fireEvent, queryByText } from "@testing-library/react-native";
import { Image } from "react-native";
import { ButtonBar } from "../ButtonBar";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("../../lib/firebase");

test("button Bar", () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON } = render(<ButtonBar navigation={navigation} />);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});

test("press button WebPortal", () => {
	const navigation = { navigate: jest.fn() };

	const { queryByText } = render(<ButtonBar navigation={navigation} />);

	fireEvent.press(queryByText("Newsletters"));
	expect(navigation.navigate).toHaveBeenCalledWith("WebPortal", {
		url: "https://iflaapr.org/newsletters",
		title: "Newsletters",
	});

	fireEvent.press(queryByText("Directory"));
	expect(navigation.navigate).toHaveBeenCalledWith("WebPortal", {
		url: "https://iflaapr.org/membership-directory/corporate",
		title: "Directory",
	});
});
