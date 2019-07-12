import React from "react";
import useGlobalHook from "use-global-hook";
import { AsyncStorage } from 'react-native'
import firebase from "firebase";

const initialState = {
  loading: true,
  searchTerm: "",
  date: "",
  beaconState: "",
  grade: null,
  class: "",
  initial: true
};

const setBeaconState = (store, beaconState) => {
  store.setState({ beaconState });
};

const setGrade = (store, grade) => {
  store.setState({ grade });
};

const setClass = (store, str_class) => {
  store.setState({ class: str_class });
};



const actions = { setBeaconState, setGrade, setClass };
const useBeaconSearchHook = useGlobalHook(React, initialState, actions);

export default useBeaconSearchHook;
