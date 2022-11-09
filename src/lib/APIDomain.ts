import app from "../lib/firebase";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";

interface IDomain {
	key: string;
	name: string;
	node: string;
}

type domainsRead = (domains: IDomain[]) => void;

export async function getDomains(callback: domainsRead) {
	const domains: IDomain[] = [];

	console.log("IM GETTING DOMAINS +++++++++");

	const db = getFirestore(app);

	// Get a list of cities from your database
	async function getCities(db) {
		const citiesCol = collection(db, "cities");
		const citySnapshot = await getDocs(citiesCol);
		const cityList = citySnapshot.docs.map((doc) => doc.data());
		return cityList;
	}

	const q = query(collection(db, "domains"));
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		querySnapshot.forEach(function (doc) {
			const domain = {
				key: doc.id,
				name: doc.data().name,
				node: doc.data().node,
				admins: doc.data().admins
			};
			domains.push(domain);
			console.log("IM LOADING EACH DOMAIN");
		});
		callback(domains);
	});
	return () => unsubscribe();
}

export function isDomainAdmin(currentUid: string, adminArray: string[]) {
	if (Array.isArray(adminArray)) {
		if (adminArray.includes(currentUid)) return true;
		else return false;
	}
}

export async function isDomainAdminServer(currentUid: string, domain: string) {
	return new Promise((resolve, reject) => {
		reject(Error("isDomainAdminServer broke " + "error"));

		// firebase
		// 	.firestore()
		// 	.collection("domains")
		// 	.where("node", "==", domain)
		// 	.get()
		// 	.then(function (snapshot) {
		// 		snapshot.forEach(function (doc) {
		// 			const x = isDomainAdmin(currentUid, doc.data().admins);
		// 			resolve(x);
		// 		});
		// 	})
		// 	.catch((error) => {
		// 		reject(Error("isDomainAdminServer broke " + error));
		// 	});
	});
}
