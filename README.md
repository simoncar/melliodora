# Mellidora app.

Eucalyptus melliodora, commonly known as yellow box, is a medium-sized to occasionally tall eucalypt.

# environment setup

add a file name .env to your root directory

FIREBASE_APIKEY=yourKeyHere

(we are using gitHub actions, so also add FIREBASE_APIKEY to your github secrets)


# Code

Analytics tracking on each key page

`Analytics.track("Home", { details: "extra stuff here" });`

https://analytics.amplitude.com/smartcookies/activity


# Run

`expo start --config apps/app.generic.json`

`yarn g`

OR

`expo start --config apps/app.sais_edu_sg.json`

`yarn s`

`expo start --config apps/app.ais_edu_sg.json`

`yarn a`

# Publish

Before publishing, rebuild locales if new i18n items added

`i18n-translate-json apiKey src/locales/ en fr,es,ja,ko,zh,da,nl,fi,de,hi,id,ga,it,lt,ms,no,pl,pt,ro,ru,sl,sv,th,vi,cy`

https://github.com/meedan/i18n-translate-json


## then publish

# Github actions now auto-deploy this application when you commit to master

https://github.com/simoncar/melliodora/actions

https://github.com/simoncar/melliodora/blob/master/.github/workflows/main.yml

(if you add a new config file, update the main.yml above)

`expo publish --config apps/app.generic.json`
`expo publish --config apps/app.sais_edu_sg.json`
`expo publish --config apps/app.ais_edu_sg.json`

# Build (and Publish)

Before building - update version numbers app.*.json

## App Store (iOS)

Build occurs automatically when push to the appstore branch
https://github.com/simoncar/melliodora/blob/master/.github/workflows/appStore.yml

There is no need to run these commands
`expo build:ios --config apps/app.generic.json`
`expo build:ios --config apps/app.sais_edu_sg.json`
`expo build:android -t app-bundle --config apps/app.generic.json`
`expo build:android -t app-bundle --config apps/app.sais_edu_sg.json`

## upload - iOS

`expo upload:ios --config apps/app.generic.json && expo upload:ios --config apps/app.sais_edu_sg.json

## upload - Google Plan. 

need to do this manually 


## Web (This project not web ready yet)

`expo build:web --config apps/app.sais_edu_sg.json`


### Android Emulator

emulator @Pixel_3a_XL_API_R -dns-server 8.8.8.8
