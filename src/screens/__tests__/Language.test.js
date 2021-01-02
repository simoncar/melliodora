import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { SelectLanguage } from '../Language';

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

const authNoLanguage = {
	"_persist": {
		"rehydrated": true,
		"version": -1,
	},
	"adminPassword": "cookies",
	"isAdmin": true,
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

test('show language selector', () => {
	const navigation = { navigate: jest.fn() };
	const changeLanguage = jest.fn();

	const { toJSON, queryByText } = render(
		<SelectLanguage
			auth={auth}
			navigation={navigation}
			dispatch={changeLanguage}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("English")).not.toBeNull();
	expect(queryByText("中文(简体)")).not.toBeNull();
	expect(queryByText("日本語")).not.toBeNull();
	expect(queryByText("Français")).not.toBeNull();
	expect(queryByText("한국어")).not.toBeNull();
	expect(queryByText("Español")).not.toBeNull();
	expect(queryByText("bahasa Indonesia")).not.toBeNull();

	fireEvent.press(queryByText('English'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "en", "type": "CHANGE_LANGUAGE" });

	fireEvent.press(queryByText('中文(简体)'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "zh", "type": "CHANGE_LANGUAGE" });

	fireEvent.press(queryByText('日本語'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "ja", "type": "CHANGE_LANGUAGE" });

	fireEvent.press(queryByText('Français'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "fr", "type": "CHANGE_LANGUAGE" });

	fireEvent.press(queryByText('한국어'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "ko", "type": "CHANGE_LANGUAGE" });

	fireEvent.press(queryByText('Español'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "es", "type": "CHANGE_LANGUAGE" });

	fireEvent.press(queryByText('bahasa Indonesia'));
	expect(changeLanguage).toHaveBeenCalledWith({ "language": "id", "type": "CHANGE_LANGUAGE" });


});


test('show language selector with no default language', () => {
	const navigation = { navigate: jest.fn() };
	const changeLanguage = jest.fn();

	const { toJSON, queryByText } = render(
		<SelectLanguage
			auth={authNoLanguage}
			navigation={navigation}
			dispatch={changeLanguage}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("English")).not.toBeNull();
});