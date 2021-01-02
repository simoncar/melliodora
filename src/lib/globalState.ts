import  {  useEffect } from "react";
import GlobalStore from 'react-native-global-state-hooks';

//const countStore = new GlobalStore(0);

const domainStore = new GlobalStore("", null, 'globalState_DOMAIN_NODE');
const domainNameStore = new GlobalStore("", null, 'globalState_DOMAIN_NAME');
const domainsStore = new GlobalStore("", null, 'globalState_DOMAINS');
const authStore = new GlobalStore("", null, 'globalState_AUTH');
const loginStore = new GlobalStore(false, null,'globalState_LOGIN')
const emailStore = new GlobalStore("", null, 'globalState_EMAIL');
const uidStore = new GlobalStore("", null, 'globalState_UID');
const displayNameStore = new GlobalStore("", null, 'globalState_DISPLAYNAME');
const photoURLStore = new GlobalStore("", null, 'globalState_PHOTOURL');
const languageStore = new GlobalStore("", null, 'globalState_LANGUAGE')

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
  const [refresh, setter, state, isUpdated] = useDomain();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const useDomainNameP = () => {
  const [refresh, setter, state, isUpdated] = useDomainName();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const useDomainsP = () => {
  const [refresh, setter, state, isUpdated] = useDomains();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const useAuthP = () => {
  const [refresh, setter, state, isUpdated] = useAuth();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const useLoginP = () => {
  const [refresh, setter, state, isUpdated] = useLogin();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}
export const useEmailP = () => {
  const [refresh, setter, state, isUpdated] = useEmail();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}
export const useUidP = () => {
  const [refresh, setter, state, isUpdated] = useUid();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const useDisplayNameP = () => {
  const [refresh, setter, state, isUpdated] = useDisplayName();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const usePhotoURLP = () => {
  const [refresh, setter, state, isUpdated] = usePhotoURL();
  useEffect(() => {refresh(); }, []);
  return [state, setter, isUpdated];
}

export const useLanguageP = () => {
  const [refresh, setter, state, isUpdated] = useLanguage();
	useEffect(() => {
		refresh();
	}, []);

  return [state, setter, isUpdated];
}


