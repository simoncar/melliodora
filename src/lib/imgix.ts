
export function img(photo: string) {
	if (!photo) return false;

	return photo.replace("https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/", "http://smartcookies.imgix.net/");
}

