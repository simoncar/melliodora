import { Permissions, Notifications, Constants } from 'expo';

// Example server, implemented in Rails: https://git.io/vKHKv
//const PUSH_ENDPOINT = 'https://exponent-push-server.herokuapp.com/tokens';
//const PUSH_ENDPOINT = 'https://mystamford.herokuapp.com/tokens';

const PUSH_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwhrlEfQhiSgcsF6AM_AlaMWxU7SsEtJ-yQpvthyQTT1jui588E/exec';
const installationID = Constants.installationId;

export default (async function registerForPushNotificationsAsync(user) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS

  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log('REGISTER PUSH TOKEN=',token);

  // POST the token to our backend so we can use it to send pushes from there
  return fetch(PUSH_ENDPOINT + '?token=' + token + '&user=' + user, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      user: {
        username: user,
      },
      installationID: {
        installationID: installationID,
      },
    }),
  });
});
