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
