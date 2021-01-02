import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../Login';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('../../lib/firebase')

test('show login screen', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId, queryByText } = render(
		<LoginScreen
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Forgotten Password?")).not.toBeNull();
	expect(queryByText("Create Account")).not.toBeNull();

	expect(getByTestId('login.email').props).toEqual(
		expect.objectContaining({
			placeholder: 'Email',
		})
	);
	expect(getByTestId('login.password').props).toEqual(
		expect.objectContaining({
			placeholder: 'Password',
		})
	);

});
