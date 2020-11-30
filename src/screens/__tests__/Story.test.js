import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { Story } from '../Story';

jest.mock("../../components/ImageList");
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


const itemCore = {
	params: {
		"source": "feature",
		"dateTimeEnd": null,
		"dateTimeStart": null,
		"card": true,
		"cardStyle": {
			"borderWidth": 0,
		},
		"_key": "dDbhWxL1hLyFhF6uReK6",
		"date_start": "2020-11-30",
		"description": "While your school may order extra books to sell during distribution, a yearbook will not be reserved in your name. To ensure that you receive a book, we encourage you to purchase before your school's order deadline.",
		"descriptionEN": "While your school may order extra books to sell during distribution, a yearbook will not be reserved in your name. To ensure that you receive a book, we encourage you to purchase before your school's order deadline.",
		"descriptionES": "Si bien su escuela puede ordenar libros adicionales para vender durante la distribución, no se reservará un anuario a su nombre. Para garantizar que reciba un libro, le recomendamos que compre antes de la fecha límite de pedido de su escuela.",
		"descriptionFR": "Bien que votre école puisse commander des livres supplémentaires à vendre pendant la distribution, un annuaire ne sera pas réservé à votre nom. Pour vous assurer de recevoir un livre, nous vous encourageons à acheter avant la date limite de commande de votre école.",
		"descriptionID": "Meskipun sekolah Anda dapat memesan buku tambahan untuk dijual selama distribusi, buku tahunan tidak akan dicadangkan atas nama Anda. Untuk memastikan Anda menerima buku, kami sarankan Anda membeli sebelum batas waktu pesanan sekolah Anda.",
		"descriptionJA": "学校は配布中に販売する追加の書籍を注文する場合がありますが、年鑑はあなたの名前では予約されません。本を確実に受け取るために、学校の注文締め切り前に購入することをお勧めします。",
		"descriptionKO": "학교에서 배포 중에 추가 책을 주문할 수도 있지만, 연감은 귀하의 이름으로 예약되지 않습니다. 책을 받으려면 학교 주문 마감일 전에 구입하는 것이 좋습니다.",
		"descriptionMyLanguage": "While your school may order extra books to sell during distribution, a yearbook will not be reserved in your name. To ensure that you receive a book, we encourage you to purchase before your school's order deadline.",
		"descriptionZH": "虽然您的学校可能会在分发过程中订购额外的书来出售，但不会以您的名义保留年鉴。为了确保您收到一本书，我们建议您在学校订购截止日期之前购买。",
		"order": 3,
		"photo1": "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F202002%2Fe753a7af-7010-47c1-8aca-fa9b945ae3e2?alt=media&token=ceec7bbb-757e-416e-9a67-b74eac51fa9f",
		"showIconChat": true,
		"showIconShare": true,
		"summary": "Yearbook",
		"summaryEN": "Yearbook",
		"summaryES": "Anuario",
		"summaryFR": "Annuaire",
		"summaryID": "Buku tahunan",
		"summaryJA": "卒業記念アルバム",
		"summaryKO": "연감",
		"summaryMyLanguage": "Yearbook",
		"summaryZH": "年鉴",
		"time_end_pretty": null,
		"time_start_pretty": null,
		"translated": true,
		"visible": true,
		"visibleMore": true,
		"language": "en",
		"location": "School cafe"
	}
}

const itemURLlinking = {

	params: {
		...itemCore.params,
		"descriptionMyLanguage": "google https://google.com is a website mys https://mystamford.edu.sg/somepage is a website, test@smartcookies.io is an email and 444-555-6666 is a phone number",
		"location": "At Google Campus"
	}
}



const itemNoChat = {

	params: {
		...itemCore.params,
		"showIconChat": false,
	}
}

const itemNoCalendarNoImage = {

	params: {
		...itemCore.params,
		"date_start": "",
		"photo1": "",
	}
}

test('show story on screen', () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn()
	};

	const { toJSON, queryByTestId, getByTestId, queryByText } = render(
		<Story
			route={itemCore}
			auth={auth}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Yearbook")).not.toBeNull();
	expect(queryByText("School cafe")).not.toBeNull();
	expect(queryByText("While your school may order extra books to sell during distribution, a yearbook will not be reserved in your name. To ensure that you receive a book, we encourage you to purchase before your school's order deadline.")).not.toBeNull();
	expect(queryByTestId('story.chatIcon')).not.toBeNull();

	fireEvent.press(getByTestId('story.shareButton'));
	fireEvent.press(getByTestId('story.chatIcon'));
	fireEvent.press(getByTestId('story.calendarIcon'));
	// expect(navigation.navigate).toHaveBeenCalled();
	// expect(navigation.navigate).toHaveBeenCalledWith("Beacons", { beaconState: "Entered", enrolled: false });

});

test('show story with URL in content to test linking', () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn()
	};

	const { toJSON, queryByText } = render(
		<Story
			route={itemURLlinking}
			auth={auth}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Yearbook")).not.toBeNull();
	expect(queryByText("At Google Campus")).not.toBeNull();
	expect(queryByText("google https://google.com is a website mys https://mystamford.edu.sg/somepage is a website, test@smartcookies.io is an email and 444-555-6666 is a phone number")).not.toBeNull();

	fireEvent.press(queryByText('https://google.com'));
	fireEvent.press(queryByText('https://mystamford.edu.sg/somepage'));
	fireEvent.press(queryByText('test@smartcookies.io'));
	fireEvent.press(queryByText('444-555-6666'));
});




test('show story without chat', () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn()
	};

	const { toJSON, queryByTestId, queryByText } = render(
		<Story
			route={itemNoChat}
			auth={auth}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Yearbook")).not.toBeNull();
	expect(queryByText("School cafe")).not.toBeNull();
	expect(queryByTestId('story.chatIcon')).toBeNull();
});


test('show story no calendar no image', () => {
	const navigation = {
		navigate: jest.fn(),
		setOptions: jest.fn()
	};

	const { toJSON, queryByTestId, queryByText } = render(
		<Story
			route={itemNoCalendarNoImage}
			auth={auth}
			navigation={navigation} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Yearbook")).not.toBeNull();
	expect(queryByText("School cafe")).not.toBeNull();
	expect(queryByTestId('story.calendarIcon')).toBeNull();
});


