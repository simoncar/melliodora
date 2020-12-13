import * as firebase from "firebase";
import { StoryEntity } from './interfaces';
import { getLanguageString } from "./global";

export async function getStories(domain: string) {

	return new Promise((resolve, reject) => {
		const stories = []

		firebase
			.firestore()
			.collection(domain)
			.doc("feature")
			.collection("features")
			.orderBy("order")
			.get()
			.then(function (snapshot) {
				snapshot.forEach(function (doc) {
					const story = getStory(doc.data(), doc.id)
					stories.push(story);

				})
				resolve(stories);
			})
			.catch(error => {
				reject(Error("It broke " + error));
			})

	})
}

function getStory(story: any, id: string): StoryEntity {

	var trans = {};
	var returnStory = {}

	if (story.translated == true) {
		trans = {
			source: "feature",
			summaryMyLanguage: getLanguageString(story.language, story, "summary"),
			descriptionMyLanguage: getLanguageString(story.language, story, "description")
		};
	} else {
		trans = {
			source: "feature",
			summaryMyLanguage: story.summary,
			descriptionMyLanguage: story.description
		};
	}

	if (story.photo1 === undefined || story.photo1 === "") {
		story.photo1 = "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2FdefaultCalendar.jpg?alt=media&token=e7ba4a0a-e785-4601-bcae-5e43ce71e680"
	}

	console.log(story.photo1)




	returnStory = { ...{ _key: id }, ...story, ...trans }



	return returnStory

}