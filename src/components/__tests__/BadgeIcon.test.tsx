/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { render } from '@testing-library/react-native';
import { Image } from 'react-native';
import BadgeIcon from '../BadgeIcon';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('../../lib/firebase')

test('Badge icon render', () => {
	const getSizeMock = jest.spyOn(Image, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<BadgeIcon
			style={{
				alignSelf: "flex-end",
				position: "absolute"
			}}
			visible={true}
			icon="check-bold"
		/>
	);

	expect(toJSON()).toMatchSnapshot();
});

test('Badge icon render not visible', () => {
	const getSizeMock = jest.spyOn(Image, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<BadgeIcon
			style={{
				alignSelf: "flex-end",
				position: "absolute"
			}}
			visible={false}
			icon="check-bold"
		/>
	);

	expect(toJSON()).toMatchSnapshot();
});
