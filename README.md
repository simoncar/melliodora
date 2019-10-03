# Mellidora app

Eucalyptus melliodora, commonly known as yellow box, is a medium-sized to occasionally tall eucalypt.


# Run

expo start --config apps/app.generic.json

yarn g

OR

expo start --config apps/app.sais_edu_sg.json

yarn s

expo start --config apps/app.ais_edu_sg.json

yarn a

# Publish

expo publish --config apps/app.generic.json

expo publish --config apps/app.sais_edu_sg.json

expo publish --config apps/app.sais_edu_sg.json

# Build (and Publish)

## App Store (iOS)

expo build:android --config apps/app.generic.json

expo build:ios --config apps/app.sais_edu_sg.json

## Google Play (Android)

expo build:android --config apps/app.generic.json

expo build:android --config apps/app.sais_edu_sg.json

## Web (This project not web ready yet)

expo build:web --config apps/app.sais_edu_sg.json
