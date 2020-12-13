import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Image } from 'react-native';
import BadgeIcon from '../BadgeIcon';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');


<BadgeIcon
	style={styles.badge}
	visible={item.selected}
	icon="check-bold"
/>

const itemVisible = {

	"style": "http://",
	"visible": true,
	"icon": "check-bold",
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
	const getSizeMock = jest.spyOn(Image, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<BadgeIcon
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
	const getSizeMock = jest.spyOn(Image, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

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
	const getSizeMock = jest.spyOn(Image, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

	const { toJSON } = render(
		<AlbumImage

		/>
	);

	expect(toJSON()).toMatchSnapshot();
	//expect(queryByText("Yearbook")).not.toBeNull();
	//expect(queryByText("School cafe")).not.toBeNull();
});

test('Delete button press', () => {
	const getSizeMock = jest.spyOn(Image, 'getSize');
	getSizeMock.mockImplementation(() => { /* do nothing */ });

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





