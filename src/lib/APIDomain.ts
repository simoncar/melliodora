import firebase from "../lib/firebase";

interface IDomain {
	key: string;
	name: string;
	node: string;
}

type domainsRead = (domains: IDomain[]) => void;

export async function getDomains(callback: domainsRead) {
	const domains: IDomain[] = [];

	const unsubscribe = firebase
		.firestore()
		.collection("domains")
		.orderBy("name")
		.onSnapshot(function (snapshot) {
			snapshot.forEach(function (doc) {
				const domain = {
					key: doc.id,
					name: doc.data().name,
					node: doc.data().node,
					admins: doc.data().admins,
				};
				domains.push(domain);
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
		firebase
			.firestore()
			.collection("domains")
			.where("node", "==", domain)
			.get()
			.then(function (snapshot) {
				snapshot.forEach(function (doc) {
					const x = isDomainAdmin(currentUid, doc.data().admins);
					resolve(x);
				});
			})
			.catch((error) => {
				reject(Error("isDomainAdminServer broke " + error));
			});
	});
}
