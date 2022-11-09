const commonConfig = {
	"name": "Polo Photos",
		"owner": "simoncar",
		"version": "40.0.0",
		"icon": "./resources/genericApp/iconPolo.png",
		"slug": "polo",
		"description": "Photo Roll Sharing",
		"updates": {
			"fallbackToCacheTimeout": 5000
		},
		"extra": {
			"domain": "",
			"googlePlay": "https://play.google.com/store/apps/details?id=com.softmowertrain.parent.mycommunity",
			"appleAppStore": "https://apps.apple.com/us/app/id1479940273"
		
		},
		"splash": {
			"image": "./resources/genericApp/splashPolo.png",
			"backgroundColor": "#2AE"
		},
		"hooks": {
			"postPublish": [
				{
					"file": "sentry-expo/upload-sourcemaps",
					"config": {
						"organization": "mower-train-software",
						"project": "polo",
						"authToken": "92c8da52431846ca8f6fe52b9de0db28b039efc6463b4e56996c4a583a75dda1"
					}
				}
			]
		},
		"notification": {
			"icon": "./resources/genericApp/iconPolo.png",
			"color": "#2AE"
		},
		"orientation": "portrait",
		"ios": {
			"bundleIdentifier": "photos.polo.app",
			"googleServicesFile": "./resources/genericApp/GoogleService-Info.plist",
			"supportsTablet": true,
			"buildNumber": "7",
			"infoPlist": {
				"NSCameraUsageDescription": "This app uses the camera to take photos for your Polo Roll."
			}
		},
		"android": {
			"package": "photos.polo.app",
			"googleServicesFile": "./resources/genericApp/google-services.json",
			"versionCode": 27,
			"permissions": ["READ_CALENDAR", "WRITE_CALENDAR", "CAMERA"]
		},
		"web": {
			"favicon": "./resources/genericApp/iconPolo.png",
			"config": {
				"firebase": {
					"apiKey": "AIzaSyAbCADtQsj1lTQWD1pfaOMi-WHUGkRFTXw",
					"measurementId": "G-0T769CEZVP",
					"authDomain": "calendar-app-57e88.firebaseapp.com",
					"databaseURL": "https://calendar-app-57e88.firebaseio.com",
					"projectId": "calendar-app-57e88",
					"storageBucket": "calendar-app-57e88.appspot.com",
					"appId": "1:991350571487:web:64e8030d8ad0c20969c46a"
				}
			}
		},
		"androidStatusBarColor": "#2AE",
		"androidStatusBar": {
			"barStyle": "dark-content",
			"backgroundColor": "#2AE"
		},
		"platforms": ["android", "ios", "web"]
};

module.exports = () => {
	if (process.env.APP_ENV === "production") {
		return {
			...commonConfig,
			name: "MyApp",
			extra: {
				apiUrl: "https://production.com/api"
			}
		};
	} else if (process.env.APP_ENV === "staging") {
		return {
			...commonConfig,
			name: "MyApp (Staging)",
			extra: {
				apiUrl: "https://staging.com/api"
			}
		};
	} else {
		return {
			...commonConfig,
			name: "MyApp (Development)",
			extra: {
				apiUrl: "https://localhost:3000/api"
			}
		};
	}
};
