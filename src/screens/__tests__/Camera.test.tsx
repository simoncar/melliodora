import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import * as Permissions from "expo-permissions";
import CameraScreen from '../Camera';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('../../lib/firebase')
jest.mock('expo', () => ({
	Permissions: {
		askAsync: jest.fn(),
	}
}));

test('show camera screen', async () => {
	const navigation = { navigate: jest.fn() };
	const onGoBack = jest.fn();
	Permissions.askAsync.mockImplementation(() => { return { status: 'granted' }; });

	const { toJSON, getByTestId } = render(
		<CameraScreen
			navigation={navigation}
			dispatch={onGoBack}
		/>
	);

	await waitFor(() => getByTestId('camera.takePhoto'));

	expect(toJSON()).toMatchSnapshot();

	fireEvent.press(getByTestId('camera.takePhoto'));

});


test('no access to camera', async () => {
	const navigation = { navigate: jest.fn() };
	const onGoBack = jest.fn();
	Permissions.askAsync.mockImplementation(() => { return { status: 'denied' }; });

	const { toJSON, getByText } = render(
		<CameraScreen
			navigation={navigation}
			dispatch={onGoBack}
		/>
	);

	await waitFor(() => getByText('No access to camera'));

	expect(toJSON()).toMatchSnapshot();


});
