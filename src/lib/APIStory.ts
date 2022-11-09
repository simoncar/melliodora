import { collection, query, where, onSnapshot } from "firebase/firestore";
import { StoryEntity } from "./interfaces";
import { getLanguageString } from "./global";

type storyRead = (stories: StoryEntity[]) => void;

export function getStories(domain: string, language: string, callback: storyRead) {
	// const unsubscribe = firebase
	// 	.collection(domain)
	// 	.doc("feature")
	// 	.collection("features")
	// 	.orderBy("order")

	const q = query(collection(domain, "feature", "features"));

	const unsubscribe = onSnapshot(q, (snapshot) => {
		const stories: StoryEntity[] = [];
		snapshot.forEach(function (doc) {
			const story: StoryEntity = getStory(doc.data(), doc.id, language);
			stories.push(story);
		});

		callback(stories);
	});

	return () => unsubscribe();
}

export function getStory(story: StoryEntity, id: string, language: string): StoryEntity {
	var trans = {};
	var returnStory: StoryEntity;

	if (story.translated == true) {
		trans = {
			source: "feature",
			summaryMyLanguage: getLanguageString(language, story, "summary"),
			descriptionMyLanguage: getLanguageString(language, story, "description")
		};
	} else {
		trans = {
			source: "feature",
			summaryMyLanguage: story.summary,
			descriptionMyLanguage: story.description
		};
	}

	if (story.photo1 === undefined || story.photo1 === "") {
		story.photo1 = "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2FdefaultCalendar.jpg?alt=media&token=e7ba4a0a-e785-4601-bcae-5e43ce71e680";
	}

	returnStory = { ...{ key: id }, ...story, ...trans };

	return returnStory;
}
