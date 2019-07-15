import Constants from 'expo-constants'

const isProduction = !!(Constants.manifest.id === Constants.manifest.publishedTime)

export default {
  isProduction,
}
