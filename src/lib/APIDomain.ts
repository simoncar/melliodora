import * as firebase from "firebase";

interface IDomain {
	_key: string;
	name: string;
	node: string;
}

export async function getDomains() {
	console.log("getDomains called");

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
	console.log("isDomainAdmin:", currentUid, adminArray);
	if (Array.isArray(adminArray)) {
		if (adminArray.includes(currentUid)) return true;
		else return false;
	}
}

export function isDomainAdminServer(currentUid: string, domain: string) {
	console.log("isDomainAdminServer:", currentUid, domain);

	firebase
		.firestore()
		.collection("domains")
		.where("node", "==", domain)
		.get()
		.then(function (snapshot) {
			snapshot.forEach(function (doc) {
				const x = isDomainAdmin(currentUid, doc.data().admins);
				return x;
			});
		})
		.catch((error) => {
			console.log("isDomainAdminServer failed:", error);
			return false;
		});
}
