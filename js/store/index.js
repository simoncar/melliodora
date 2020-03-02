
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import communityCreation from './communityCreation';
import settings from './settings';
import auth from './auth';
import community from './community';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["settings", "community"]
}

const rootReducer = combineReducers({
    communityCreation,
    settings,
    auth,
    community
});

export default persistReducer(rootPersistConfig, rootReducer);