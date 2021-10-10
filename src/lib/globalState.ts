import GlobalStore from "react-native-global-state-hooks";
import { DomainEntity, AuthEntity } from "./interfaces";

const domainStore = new GlobalStore("", null, "globalState_DOMAIN_NODE");
const domainNameStore = new GlobalStore("", null, "globalState_DOMAIN_NAME");
const domainsStore = new GlobalStore("", null, "globalState_DOMAINS");
const authStore = new GlobalStore("", null, "globalState_AUTH");
const loginStore = new GlobalStore(false, null, "globalState_LOGIN");
const emailStore = new GlobalStore("", null, "globalState_EMAIL");
const uidStore = new GlobalStore("", null, "globalState_UID");
const displayNameStore = new GlobalStore("", null, "globalState_DISPLAYNAME");
const photoURLStore = new GlobalStore("", null, "globalState_PHOTOURL");
const languageStore = new GlobalStore("", null, "globalState_LANGUAGE");

const adminStore = new GlobalStore(false);

export const useDomain = domainStore.getHook();
export const useDomainName = domainNameStore.getHook();
export const useDomains = domainsStore.getHook();

export const useAuth = authStore.getHook();

export const useEmail = emailStore.getHook();
export const useLogin = loginStore.getHook();
export const useUid = uidStore.getHook();
export const useDisplayName = displayNameStore.getHook();
export const usePhotoURL = photoURLStore.getHook();
export const useLanguage = languageStore.getHook();

export const useAdmin = adminStore.getHook();

export const useDomainP = () => {
	const [state, setter, isUpdated] = useDomain();
	return [state, setter, isUpdated];
};

export const DomainObj = () => {
	const [stateDomain] = useDomain();
	const [stateDomainName] = useDomainName();

	const domain: DomainEntity = {
		node: stateDomain,
		name: stateDomainName,
	};

	return domain;
};

export const AuthObj = () => {
	const [stateEmail] = useEmail();
	const [stateLogin] = useLogin();
	const [stateUid] = useUid();
	const [stateDisplayName] = useDisplayName();
	const [statePhotoURL] = usePhotoURL();
	const [stateLanguage] = useLanguage();

	const auth: AuthEntity = {
		uid: stateUid,
		displayName: stateDisplayName,
		email: stateEmail,
		login: stateLogin,
		language: stateLanguage,
		photoURL: statePhotoURL,
	};

	return auth;
};

export const useDomainNameP = () => {
	const [state, setter, isUpdated] = useDomainName();
	return [state, setter, isUpdated];
};

export const useDomainsP = () => {
	const [state, setter, isUpdated] = useDomains();
	return [state, setter, isUpdated];
};

export const useAuthP = () => {
	const [state, setter, isUpdated] = useAuth();
	return [state, setter, isUpdated];
};

export const useLoginP = () => {
	const [state, setter, isUpdated] = useLogin();
	return [state, setter, isUpdated];
};
export const useEmailP = () => {
	const [state, setter, isUpdated] = useEmail();
	return [state, setter, isUpdated];
};
export const useUidP = () => {
	const [state, setter, isUpdated] = useUid();
	return [state, setter, isUpdated];
};

export const useDisplayNameP = () => {
	const [state, setter, isUpdated] = useDisplayName();
	return [state, setter, isUpdated];
};

export const usePhotoURLP = () => {
	const [state, setter, isUpdated] = usePhotoURL();
	return [state, setter, isUpdated];
};

export const useLanguageP = () => {
	const [state, setter, isUpdated] = useLanguage();
	return [state, setter, isUpdated];
};
