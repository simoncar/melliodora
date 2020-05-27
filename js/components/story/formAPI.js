import * as firebase from "firebase";

function SaveFeature(dict) {
  const { _key, summary, description, order, photo1, showIconChat, visible, visibleMore } = dict;

  const storyDict = {
    summary: summary || "Title",
    description: description || "Description",
    order: order !== undefined ? Number(order) : 1,
    showIconChat: showIconChat,
    visible: visible,
    visibleMore: visibleMore,
    translated: false,
    photo1: photo1,
  };

  if (_key == "") {
    firebase.firestore().collection(global.domain).doc("feature").collection("features").add(storyDict);
    // .then(() => navigation.goBack());
  } else {
    const storyRef = firebase.firestore().collection(global.domain).doc("feature").collection("features").doc(_key);

    storyRef.set(storyDict, { merge: true });
  }

  return;
}

function DeleteFeature(_key, handler) {
  if (_key) {
    firebase
      .firestore()
      .collection(global.domain)
      .doc("feature")
      .collection("features")
      .doc(_key)
      .delete()
      .then(() => handler);
  }

  return;
}

module.exports = {
  SaveFeature,
  DeleteFeature,
};
