import * as firebase from "firebase";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

export const SET_FEATURES = 'SET_FEATURES';
export const RETRIEVE_FEATURES = 'RETRIEVE_FEATURES';
export const SAVE_FEATURE_CHANGES = 'SAVE_FEATURE_CHANGES';

export const setFeatures = features => ({
    type: SET_FEATURES,
    features,
});

export const actionRetrieveFeatures = () => ({
    type: RETRIEVE_FEATURES
});

export const saveFeatureChanges = () => ({
    type: SAVE_FEATURE_CHANGES
})

export const retrieveFeatures = async () => {
    try {
        console.log("retrivin features2");

        const doc = await firebase
            .firestore()
            .collection(global.domain)
            .doc("config")
            .get();

        if (doc.exists) {
            const docData = doc.data();
            if (docData.moreListings) {
                return docData.moreListings;
            }
        }
        return [];

    } catch (error) {
        // Error retrieving data
    }
};

function* WORKER_saveFeatureChanges() {
    try {
        console.log("exectuing saveFeatureChanges")
        const docData = { moreListings: changedFeatures };
        yield call(() => firebase
            .firestore()
            .collection(global.domain)
            .doc("config")
            .set(docData, { merge: true }));
        yield put(setFeatures(changedFeatures));

    } catch (error) {
        // Error retrieving data
    }
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* WORKER_retrieveFeatures() {
    try {
        // do api call
        const data = yield call(retrieveFeatures);
        yield put(setFeatures(data));
    } catch (e) {
        console.log(e);
    }
}

//  Watcher
export function* settingsSaga() {
    yield takeLatest(RETRIEVE_FEATURES, WORKER_retrieveFeatures);
    yield takeLatest(SAVE_FEATURE_CHANGES, WORKER_saveFeatureChanges);
}

const initialState = {
    features: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_FEATURES:
            return {
                ...state,
                features: action.features,
            };
        default:
            return state;
    }
};