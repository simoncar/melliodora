export interface IImage {
	id: string;
	uri: string;
}

export enum MemeType {
	Gallery = 'gallery',
	Local = 'local',
	Remote = 'remote',
}

export interface MemeEntity extends IImage {
	title?: string;
	content?: string;
	type: MemeType;
}

export interface StoryEntity {
	_key: string,
	photo1: string,
	summary: string,
	summaryMyLanguage?: string,
	descriptionMyLanguage?: string,
	description: string,
	visible: boolean,
	showIconChat: boolean,
	order: number,
	date_start: string,
	time_start_pretty: string,
	time_end_pretty: string,
	source?: any,
	dateTimeStart: any,
	dateTimeEnd: any,
	location?: any,
	scroll?: boolean,
	newState?: any,
}

export interface StoryState extends StoryEntity {
	cameraIcon: string,
	edit: boolean
}
