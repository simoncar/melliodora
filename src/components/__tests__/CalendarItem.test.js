import React from 'react';
import { render } from '@testing-library/react-native';
import { Image } from 'react-native';
import CalendarItem from '../CalendarItem';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

const itemCalendarDate = {
	"source": "calendar",
	"card": false,
	"_key": "demo data 2",
	"color": "red",
	"date_start": "2020-06-12",
	"date_time_start": "20200612",
	"demo": true,
	"description": "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.",
	"descriptionMyLanguage": "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.",
	"dtstamp": "2020222222211111",
	"icon": "ios-musical-notes",
	"location": "Music Room",
	"number": undefined,
	"showIconChat": false,
	"summary": "Suzuki Showcase Concert",
	"summaryEN": "Suzuki Showcase Concert",
	"summaryMyLanguage": "Suzuki Showcase Concert",
	"visible": true,
}

const itemCalendarDateImage = {
	"source": "calendar",
	"card": false,
	"_key": "demo data 2",
	"color": "red",
	"date_start": "2020-06-12",
	"date_time_start": "20200612",
	"demo": true,
	"description": "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.",
	"descriptionMyLanguage": "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.",
	"dtstamp": "2020222222211111",
	"icon": "ios-musical-notes",
	"location": "Music Room",
	"number": undefined,
	"showIconChat": false,
	"summary": "Suzuki Showcase Concert",
	"summaryEN": "Suzuki Showcase Concert",
	"summaryMyLanguage": "Suzuki Showcase Concert",
	"visible": true,
	"photo1": "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F202002%2Fe753a7af-7010-47c1-8aca-fa9b945ae3e2?alt=media&token=ceec7bbb-757e-416e-9a67-b74eac51fa9f",

}


const itemCalendarDateTime = {
	"source": "calendar",
	"card": false,
	"_key": "demo data 2",
	"color": "red",
	"date_start": "2020-06-12",
	"date_time_start": "20200612",
	"time_start_pretty": "7:30 pm",
	"time_end_pretty": "10:30 pm",
	"demo": true,
	"description": "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.",
	"descriptionMyLanguage": "The cornerstone of the Suzuki Strings program is the creation of a cooperative relationship between teacher, parent, and student.",
	"dtstamp": "2020222222211111",
	"icon": "ios-musical-notes",
	"location": "Music Room",
	"number": undefined,
	"showIconChat": false,
	"summary": "Suzuki Showcase Concert",
	"summaryEN": "Suzuki Showcase Concert",
	"summaryMyLanguage": "Suzuki Showcase Concert",
	"visible": true,
}


test('show Calendar Item with Date only', () => {
	const getSizeMock = jest.spyOn(Image, 'getSize');
	const navigation = { navigate: jest.fn() };
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<CalendarItem
			item={itemCalendarDate}
			navigation={navigation}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});


test('show Calendar Item with Date and Image', () => {
	const getSizeMock = jest.spyOn(Image, 'getSize');
	const navigation = { navigate: jest.fn() };
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<CalendarItem
			item={itemCalendarDateImage}
			navigation={navigation}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});


test('show Calendar Item with Date and Time', () => {
	const getSizeMock = jest.spyOn(Image, 'getSize');
	const navigation = { navigate: jest.fn() };
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<CalendarItem
			item={itemCalendarDateTime}
			navigation={navigation}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});





