import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { DomainSelection } from '../DomainSelection';

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



const community = {

	"calendarItems": null,
	"communities": [
		{
			"name": "Bali Children Foundation",
			"node": "balichildrenfoundation_org",
		},
		{
			"name": "Camp Asia",
			"nameAlias": [
				"ca",
			],
			"node": "camp_asia",
		},
		{
			"admins": [
				"xZI3FkYWTbTlSZgOZ4jNG7YT1nC3",
			],
			"kind": "123",
			"language": "123",
			"name": "Coco Palms",
			"node": "test",
			"region": "123",
			"users": "213",
		},
		{
			"name": "IFLA Asia Pacific",
			"nameAlias": [
				"IFLAAPR",
			],
			"node": "ais_edu_sg",
		},
		{
			"name": "My Photo Community",
			"node": "demo_sg",
		},
		{
			"name": "Oakforest International",
			"node": "oakforest_international_edu",
		},
		{
			"name": "Smart Cookies Team Hero",
			"node": "smartcookies_system_hero",
		},
		{
			"name": "Speech Language Club",
			"node": "speech_language",
		},
		{
			"name": "Stamford American",
			"nameAlias": [
				"SAIS",
			],
			"node": "sais_edu_sg",
		},
		{
			"name": "Team Entrepreneur CA",
			"node": "team_entrepreneur_ca",
		},
		{
			"admins": [
				"4lGCJyOuXfbG1ig7EHJOM6LPoji2",
			],
			"kind": "",
			"language": "",
			"name": "afrik_hub",
			"node": "afrik_hub",
			"region": "",
			"users": "",
		},
	],
	"invalidCommunity": false,
	"selectedCommunity": {},
	"userChatrooms": [],
}

test('list domains', () => {
	const navigation = { navigate: jest.fn() };
	const dispatch = jest.fn();

	const { toJSON, queryByText, getByTestId } = render(
		<DomainSelection
			community={community}
			auth={auth}
			dispatch={dispatch}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Create Community")).not.toBeNull();
	expect(queryByText("Camp Asia")).not.toBeNull();
	expect(queryByText("Oakforest International")).not.toBeNull();
	expect(queryByText("Sign In / Sign Up")).not.toBeNull();

	//console.log(getByTestId('domainSelection.search').props);
	expect(getByTestId('domainSelection.search').props).toEqual(
		expect.objectContaining({
			placeholder: 'Search',
		})
	);



	//fireEvent.press(getByTestId('story.calendarIcon'));
	// expect(navigation.navigate).toHaveBeenCalled();
	// expect(navigation.navigate).toHaveBeenCalledWith("Beacons", { beaconState: "Entered", enrolled: false });

});
