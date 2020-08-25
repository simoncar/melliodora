import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { AdminPassword } from '../AdminPassword';


jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

const auth = {
	"_persist": {
		"rehydrated": true,
		"version": -1,
	},
	"adminPassword": "cookies",
	"isAdmin": false,
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

test('show admin password', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId, queryByText } = render(
		<AdminPassword
			auth={auth}
			navigation={navigation} />

	);

	expect(toJSON()).toMatchSnapshot();


	expect(getByTestId('admin.password').props).toEqual(
		expect.objectContaining({
			placeholder: 'Password',
		})
	);



});

