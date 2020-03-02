import * as firebase from "firebase";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

export const SET_SELECTED_COMMUNITY = 'SET_SELECTED_COMMUNITY';

export const actionSetSelectedCommunity = selectedCommunity => ({
    type: SET_SELECTED_COMMUNITY,
    selectedCommunity,
});

const initialState = {
    selectedCommunity: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_COMMUNITY:
            return {
                ...state,
                selectedCommunity: action.selectedCommunity,
            };
        default:
            return state;
    }
};