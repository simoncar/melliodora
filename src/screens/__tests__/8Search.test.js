import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import Search from '../Search';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');


test('search for a calendar item', () => {
	const navigation = { navigate: jest.fn() };

	const { toJSON, getByTestId, queryByText } = render(
		<Search
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	// expect(queryByText("Yearbook")).not.toBeNull();
	// expect(queryByText("School cafe")).not.toBeNull();
	// expect(queryByText("While your school may order extra books to sell during distribution, a yearbook will not be reserved in your name. To ensure that you receive a book, we encourage you to purchase before your school's order deadline.")).not.toBeNull();
	// expect(getByTestId('story.chatIcon')).not.toBeNull();

	// fireEvent.press(getByTestId('story.shareButton'));
	// fireEvent.press(getByTestId('story.chatIcon'));
	// fireEvent.press(getByTestId('story.calendarIcon'));
	// expect(navigation.navigate).toHaveBeenCalled();
	// expect(navigation.navigate).toHaveBeenCalledWith("Beacons", { beaconState: "Entered", enrolled: false });

});