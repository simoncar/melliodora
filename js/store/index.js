
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import communityCreation from './communityCreation';
import settings from './settings';
import auth from './auth';
import community from './community';
import authPortal from './authPortal';

export const FIREBASE_READY = "FIREBASE_READY";


const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["settings", "community", "auth", "authPortal"]
}

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: ["adminPassword", "language"]
}

const rootReducer = combineReducers({
    communityCreation,
    settings,
    auth: persistReducer(authPersistConfig, auth),
    community,
    authPortal
});

export default persistReducer(rootPersistConfig, rootReducer);