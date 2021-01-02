import React from 'react';
import { render } from '@testing-library/react-native';
import DomainSelection from '../DomainSelection';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('../../lib/firebase')

jest.mock("../../lib/globalState", () => ({
	useDomainsP: () => [JSON.stringify([{
		"name": "Team Entrepreneur CA",
		"node": "team_entrepreneur_ca",
		"_key": "111113948fh38hf398h4f",
	},
	{
		"name": "Oakforest International",
		"node": "oakforest_international_edu",
		"_key": "33333948fh38hf398h4f",
	},
	{
		"name": "Camp Asia",
		"node": "camp_asia",
		"_key": "4444443948fh38hf398h4f",
	},
	])
		, jest.fn(), true],

	useCountP: () => [33
		, jest.fn(), true],
	useAdmin: () => [true
		, jest.fn(), true],
	useDomain: () => [""
		, jest.fn(), true],
	useDomainP: () => [""
		, jest.fn(), true],
	useUid: () => [""
		, jest.fn(), true],
	useDomainNameP: () => [""
		, jest.fn(), true],
	useLanguage: () => ["en"
		, jest.fn(), true],
	useLoginP: () => [false
		, jest.fn(), true],
	useUidP: () => [""
		, jest.fn(), true],
	useDisplayNameP: () => [""
		, jest.fn(), true],
	useEmailP: () => [""
		, jest.fn(), true],
	usePhotoURL: () => [""
		, jest.fn(), true],
	usePhotoURLP: () => [""
		, jest.fn(), true],
}));


test('list domains', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, queryByText } = render(
		<DomainSelection
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Create your Polo")).not.toBeNull();
	expect(queryByText("Camp Asia")).not.toBeNull();
	expect(queryByText("Oakforest International")).not.toBeNull();
	expect(queryByText("Sign In")).not.toBeNull();
	expect(queryByText("Create Account")).not.toBeNull();

});
