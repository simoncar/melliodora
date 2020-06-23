import React from 'react';
import { render, waitFor, fireEvent } from 'react-native-testing-library';
import * as Permissions from "expo-permissions";
import CameraApp from '../Camera';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('expo', () => ({
	Permissions: {
		askAsync: jest.fn(),
	}
}));

const auth = {
	"_persist": {
		"rehydrated": true,
		"version": -1,
	},
	"adminPassword": "cookies",
	"isAdmin": true,
	"language": "en",
	"user": false,
	"userInfo": {
		"email": "simoncar@gmail.com",
		"isAnonymous": true,
		"languageSelected": "en",
		"lastLogin": 1592026664066,
		"loginCount": 30,
		"phoneLocale": "en",
		"safeToken": "ExponentPushToken{YQNwZDOkv0QdHUlDV-T5HQ}",
		"token": "ExponentPushToken[YQNwZDOkv0QdHUlDV-T5HQ]",
		"uid": "AMGV7R4J7uZiE82ipxKK9tUVycb2",
		"version": "unknown",
	}
}




test('show camera screen', async () => {
	const navigation = { navigate: jest.fn() };
	const onGoBack = jest.fn();
	Permissions.askAsync.mockImplementation(() => { return { status: 'granted' }; });

	const { toJSON, getByTestId } = render(
		<CameraApp
			auth={auth}
			navigation={navigation}
			dispatch={onGoBack}
		/>
	);

	await waitFor(() => getByTestId('camera.takePhoto'));

	expect(toJSON()).toMatchSnapshot();

	fireEvent.press(getByTestId('camera.takePhoto'));
	//expect(changeLanguage).toHaveBeenCalledWith({ "language": "id", "type": "CHANGE_LANGUAGE" });

});


test('no access to camera', async () => {
	const navigation = { navigate: jest.fn() };
	const onGoBack = jest.fn();
	Permissions.askAsync.mockImplementation(() => { return { status: 'denied' }; });

	const { toJSON, getByText } = render(
		<CameraApp
			auth={auth}
			navigation={navigation}
			dispatch={onGoBack}
		/>
	);

	await waitFor(() => getByText('No access to camera'));

	expect(toJSON()).toMatchSnapshot();


});
