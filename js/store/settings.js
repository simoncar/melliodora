import * as firebase from "firebase";

export const SET_FEATURES = 'SET_FEATURES';

export const setFeatures = features => ({
    type: SET_FEATURES,
    features,
});

export const retrieveFeatures = () => async dispatch => {
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
                dispatch(setFeatures(docData.moreListings))
            }
        }

    } catch (error) {
        // Error retrieving data
    }
};

export const saveFeatureChanges = (changedFeatures) => dispatch => {
    try {
        console.log("exectuing saveFeatureChanges")
        const docData = { moreListings: changedFeatures };
        firebase
            .firestore()
            .collection(global.domain)
            .doc("config")
            .set(docData, { merge: true });
        dispatch(setFeatures(changedFeatures));

    } catch (error) {
        // Error retrieving data
    }
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