import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import AlbumImage from '../AlbumImage';

jest.mock("../../components/AlbumAPI");
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

const itemReadOnly = {

	"local": "http://",
	"server": "http://",
	"thumb": "http://",
	"key": "e834j4j8f34j8fj384fj",
	"edit": false,
	"feature": "1cdh347d7378dh37"
}

const itemEdit = {

	"local": "http://",
	"server": "http://",
	"thumb": "http://",
	"key": "e834j4j8f34j8fj384fj",
	"edit": true,
	"feature": "1cdh347d7378dh37"
}




test('show read only Album Image', () => {
	const { toJSON } = render(
		<AlbumImage
			local={itemReadOnly.local}
			server={itemReadOnly.server}
			thumb={itemReadOnly.thumb}
			edit={itemReadOnly.edit}
			feature={itemReadOnly.feature}

		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});


test('show edit Album Image', () => {
	const { toJSON } = render(
		<AlbumImage
			local={itemEdit.local}
			server={itemEdit.server}
			thumb={itemEdit.thumb}
			edit={itemEdit.edit}
			feature={itemEdit.feature}

		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});



test('show void Album Image', () => {
	const { toJSON } = render(
		<AlbumImage

		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});

test('Delete button press', () => {
	const deleteImage = { deleteImage: jest.fn() };

	const { toJSON, getByTestId } = render(
		<AlbumImage
			local={itemEdit.local}
			server={itemEdit.server}
			thumb={itemEdit.thumb}
			edit={itemEdit.edit}
			feature={itemEdit.feature}

		/>
	);

	expect(toJSON()).toMatchSnapshot();

	fireEvent.press(getByTestId('delete'));
	//expect(deleteImage.deleteImage).toHaveBeenCalled();



});





