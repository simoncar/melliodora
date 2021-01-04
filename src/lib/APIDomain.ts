import firebase from "../lib/firebase";

interface IDomain {
	_key: string;
	name: string;
	node: string;
}

export async function getDomains() {
	return new Promise((resolve, reject) => {
		const domains: IDomain[] = [];

		firebase
			.firestore()
			.collection("domains")
			.orderBy("name")
			.get()
			.then(function (snapshot) {
				snapshot.forEach(function (doc) {
					const domain = {
						_key: doc.id,
						name: doc.data().name,
						node: doc.data().node,
						admins: doc.data().admins,
					};
					domains.push(domain);
				});
				resolve(domains);
			})
			.catch((error) => {
				reject(Error("load domains broke " + error));
			});
	});
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
