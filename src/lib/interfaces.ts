export interface IImage {
	id: string;
	uri: string;
}

export enum MemeType {
	Gallery = "gallery",
	Local = "local",
	Remote = "remote",
}

export interface MemeEntity extends IImage {
	title?: string;
	content?: string;
	type: MemeType;
}

//  "userInfo": Object {
//     "communityJoined": Array [],
//     "isAnonymous": false,
//     "languageSelected": "en",
//     "lastLogin": 1608326981732,
//     "loginCount": 2,
//     "phoneLocale": "en",
//     "safeToken": "",
//     "token": "",
//     "version": "unknown",
//   },

export interface UserEntity {
	displayName: string;
	email: string;
	firstName: string;
	lastName?: string;
	uid: string;
	photoURL: string;
}

export interface MessageEntity {
	_id: string;
	createdAt: any;
	text: string;
	user: {
		_id: string;
		name: string;
		email: string;
	};
	uid: string;
}

export interface StoryEntity {
	_key: string;
	photo1: string;
	summary: string;
	summaryMyLanguage?: string;
	descriptionMyLanguage?: string;
	description: string;
	visible: boolean;
	showIconChat: boolean;
	order: number;
	date_start: string;
	time_start_pretty: string;
	time_end_pretty: string;
	source?: any;
	dateTimeStart: any;
	dateTimeEnd: any;
	location?: any;
	scroll?: boolean;
	newState?: any;
}

export interface StoryState extends StoryEntity {
	cameraIcon: string;
	edit: boolean;
}

export interface AuthUser {
	uid: string;
	displayName: string;
	photoURL?: string;
}
