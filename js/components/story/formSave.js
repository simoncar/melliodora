import * as firebase from "firebase";

function SaveData(dict) {
  const { _key, summary, description, order, photo1, showIconChat, visible, visibleMore } = dict;

  const storyDict = {
    summary: summary || "Title",
    description: description || "Description",
    order: order !== undefined ? Number(order) : 1,
    showIconChat: showIconChat,
    visible: visible,
    visibleMore: visibleMore,
    translated: false,
  };

  if (_key == "") {
    firebase
      .firestore()
      .collection(global.domain)
      .doc("feature")
      .collection("features")
      .add(storyDict)
      .then(() => navigation.goBack());
  } else {
    const storyRef = firebase.firestore().collection(global.domain).doc("feature").collection("features").doc(_key);

    storyRef.set(storyDict, { merge: true });

    //.then(() => navigation.popToTop());

    //systemHero.logToCalendar("StorySave-" + global.domain + summary, "Story Save - " + summary, global.domain, this.props.auth.userInfo.email || "");
  }

  return;
}

module.exports = {
  SaveData,
};
