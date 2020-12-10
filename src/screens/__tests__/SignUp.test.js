import React from 'react';
import { render } from '@testing-library/react-native';

import { SignUp } from '../SignUp';

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

test('show SignUp screen', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId, queryByText } = render(
		<SignUp
			auth={auth}
			navigation={navigation} />
	);




	expect(toJSON()).toMatchSnapshot();
	expect(getByTestId('signup.email').props).toEqual(
		expect.objectContaining({
			placeholder: 'Email',
		})
	);

	expect(getByTestId('signup.password').props).toEqual(
		expect.objectContaining({
			placeholder: 'Password',
		})
	);
	expect(getByTestId('signup.passwordConfirm').props).toEqual(
		expect.objectContaining({
			placeholder: 'Confirm Password',
		})
	);

	expect(getByTestId('signup.firstName').props).toEqual(
		expect.objectContaining({
			placeholder: 'First Name',
		})
	);

	expect(getByTestId('signup.lastName').props).toEqual(
		expect.objectContaining({
			placeholder: 'Last Name',
		})
	);


});
