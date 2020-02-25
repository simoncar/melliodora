
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import communityCreation from './communityCreation';
import settings from './settings';
import auth from './auth';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["settings"]
}

const rootReducer = combineReducers({
    communityCreation,
    settings,
    auth
});

export default persistReducer(rootPersistConfig, rootReducer);