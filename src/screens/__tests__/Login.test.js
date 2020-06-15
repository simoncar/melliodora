import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { LoginScreen } from '../Login';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

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

test('show login screen', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId, queryByText } = render(
		<LoginScreen
			auth={auth}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Forgot password?")).not.toBeNull();
	expect(queryByText("Register")).not.toBeNull();

	expect(getByTestId('login.email').props).toEqual(
		expect.objectContaining({
			placeholder: 'Email Address',
		})
	);
	expect(getByTestId('login.password').props).toEqual(
		expect.objectContaining({
			placeholder: 'Password',
		})
	);

});
