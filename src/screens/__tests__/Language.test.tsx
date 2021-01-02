import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SelectLanguage from "../Language";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("../../lib/firebase");

jest.mock("../../lib/globalState", () => ({
	useLanguage: () => ["en", jest.fn(), "en"],
}));

test("show language selector", () => {
	const navigation = {
		navigate: jest.fn(),
		pop: jest.fn(),
	};

	const { toJSON, queryByText } = render(<SelectLanguage navigation={navigation} />);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("English")).not.toBeNull();
	expect(queryByText("中文(简体)")).not.toBeNull();
	expect(queryByText("日本語")).not.toBeNull();
	expect(queryByText("Français")).not.toBeNull();
	expect(queryByText("한국어")).not.toBeNull();
	expect(queryByText("Español")).not.toBeNull();
	expect(queryByText("bahasa Indonesia")).not.toBeNull();

	fireEvent.press(queryByText("English"));
	//expect(changeLanguage).toHaveBeenCalledWith("en");
	expect(navigation.pop).toHaveBeenCalledWith();

	//console.log(changeLanguage.mock.calls)
	//console.log(changeLanguage.mock.results)

	fireEvent.press(queryByText("中文(简体)"));
	expect(navigation.pop).toHaveBeenCalledWith();
	// expect(changeLanguage).toHaveBeenCalledWith("zh");

	fireEvent.press(queryByText("日本語"));
	// expect(changeLanguage).toHaveBeenCalledWith("ja");

	fireEvent.press(queryByText("Français"));
	// expect(changeLanguage).toHaveBeenCalledWith("fr");

	fireEvent.press(queryByText("한국어"));
	// expect(changeLanguage).toHaveBeenCalledWith("ko");

	fireEvent.press(queryByText("Español"));
	// expect(changeLanguage).toHaveBeenCalledWith("es");

	fireEvent.press(queryByText("bahasa Indonesia"));
	// expect(changeLanguage).toHaveBeenCalledWith("id");
});

test("show language selector with no default language", () => {
	const navigation = {
		navigate: jest.fn(),
		pop: jest.fn(),
	};
	const changeLanguage = jest.fn();

	const { toJSON, queryByText } = render(<SelectLanguage navigation={navigation} />);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("English")).not.toBeNull();
});
