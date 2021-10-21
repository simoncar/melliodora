import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { Camera } from "expo-camera";
import CameraScreen from "../Camera";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("../../lib/firebase");
jest.mock("expo-camera", () => {
	const originalModule = jest.requireActual("expo-camera");

	return {
		...originalModule,
		Camera: {
			...originalModule.Camera,
			requestCameraPermissionsAsync: jest.fn(),
		},
	};
});

test("camera screen", async () => {
	const navigation = { navigate: jest.fn() };
	const onGoBack = jest.fn();

	const { toJSON, getByTestId } = render(<CameraScreen navigation={navigation} route={null} />);

	expect(toJSON()).toMatchSnapshot();
});

// test("show camera screen", async () => {
// 	const navigation = { navigate: jest.fn() };
// 	const onGoBack = jest.fn();
// 	Camera.requestCameraPermissionsAsync.mockImplementation(() => {
// 		return { status: "granted" };
// 	});

// 	const { toJSON, getByTestId } = render(<CameraScreen navigation={navigation} route={null} />);

// 	await waitFor(() => getByTestId("camera.takePhoto"));

// 	expect(toJSON()).toMatchSnapshot();

// 	fireEvent.press(getByTestId("camera.takePhoto"));
// });

// test("no access to camera", async () => {
// 	const navigation = { navigate: jest.fn() };
// 	const onGoBack = jest.fn();
// 	Camera.requestCameraPermissionsAsync.mockImplementation(() => {
// 		return { status: "denied" };
// 	});

// 	const { toJSON, getByText } = render(<CameraScreen navigation={navigation} route={null} />);

// 	await waitFor(() => getByText("No access to camera"));

// 	expect(toJSON()).toMatchSnapshot();
// });
