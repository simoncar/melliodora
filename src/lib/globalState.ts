import  {  useEffect } from "react";
import GlobalStore from 'react-native-global-state-hooks';

//const countStore = new GlobalStore(0);

const countStore = new GlobalStore(0, null, 'GLOBAL_COUNT');
const domainStore = new GlobalStore("", null, 'DOMAIN');
const domainsStore = new GlobalStore("", null, 'DOMAINS');

export const useCount = countStore.getHook();
export const useDomain = domainStore.getHook();
export const useDomains = domainsStore.getHook();

export const usePersistedCount = () => {
  const [refresh, setter, state, isUpdated] = useCount();

  useEffect(() => {
    refresh();
  }, []);

	
  return [state, setter, isUpdated];
}

export const usePersistedDomain = () => {
  const [refresh, setter, state, isUpdated] = useDomain();

  useEffect(() => {
    refresh();
  }, []);

  return [state, setter, isUpdated];
}


export const usePersistedDomains = () => {
  const [refresh, setter, state, isUpdated] = useDomains();

  useEffect(() => {
    refresh();
  }, []);
	

  return [state, setter, isUpdated];
}
