import React from 'react';
import { render } from 'react-native-testing-library';

import ListItem from '../StoryListItem';


const itemCore = {
	"source": "feature",
	"card": true,
	"cardStyle": {
		"borderWidth": 0,
	},
	"_key": "dDbhWxL1hLyFhF6uReK6",
	"date_start": null,
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


const itemCalendarDateTime = {
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

const itemBalance = {
	visible: true,
	source: "balance",
	summaryMyLanguage: "$56.20",
	summary: "$56.20",
	summaryEN: "$56.20",
	color: "red",
	showIconChat: false,
	location: "Cafeteria Account Balance"
}

test('list item  with a photo', () => {
	const { toJSON, queryByText } = render(
		<ListItem
			story={itemCore}
			card={true}
		/>
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Yearbook")).not.toBeNull();
	expect(queryByText("School cafe")).not.toBeNull();
});


test('list item of a calendar with date', () => {
	const { toJSON, queryByText } = render(
		<ListItem
			story={itemCalendarDate}
			card={true} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Suzuki Showcase Concert")).not.toBeNull();
	expect(queryByText("Music Room")).not.toBeNull();
	expect(queryByText("June 12th 2020")).not.toBeNull();
});

test('list item of a calendar with date and time', () => {
	const { toJSON, queryByText } = render(
		<ListItem
			story={itemCalendarDateTime}
			card={true} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("Suzuki Showcase Concert")).not.toBeNull();
	expect(queryByText("Music Room")).not.toBeNull();
	expect(queryByText("June 12th 2020")).not.toBeNull();
});

test('show balance', () => {
	const { toJSON, queryByText } = render(
		<ListItem
			story={itemBalance}
			card={true} />
	);

	expect(toJSON()).toMatchSnapshot();
	expect(queryByText("$56.20")).not.toBeNull();
	expect(queryByText("Cafeteria Account Balance")).not.toBeNull();
});


