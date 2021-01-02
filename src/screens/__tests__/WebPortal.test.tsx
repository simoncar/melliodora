import React from 'react';
import { render } from '@testing-library/react-native';

import { WebPortal } from '../WebPortal';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('../../lib/firebase')

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
		"email": null,
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


const itemCore = {
	params: {
		"title": "Google",
		"url": "https://www.google.com",
	}
}



test('web portal', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId } = render(
		<WebPortal
			route={itemCore}
			auth={auth}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();


	expect(getByTestId('webPortal.urlField').props).toEqual(
		expect.objectContaining({
			value: 'https://www.google.com',
		})
	);

	expect(getByTestId('webPortal.RNCWebView').props).toEqual(
		expect.objectContaining({
			source: { "uri": "https://www.google.com" },
		})
	);



});
