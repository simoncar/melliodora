import { Constants } from 'expo';

const isProduction = !!(
  Constants.manifest.id === Constants.manifest.publishedTime
);

export default {
  isProduction,
};