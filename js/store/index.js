
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import communityCreation from './communityCreation';
import settings from './settings';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["settings"]
}

const rootReducer = combineReducers({
    communityCreation,
    settings
});

export default persistReducer(rootPersistConfig, rootReducer);