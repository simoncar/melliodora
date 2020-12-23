import  {  useEffect } from "react";
import GlobalStore from 'react-native-global-state-hooks';

//const countStore = new GlobalStore(0);

const countStore = new GlobalStore(0, null, 'GLOBAL_COUNT');
const domainNodeStore = new GlobalStore("", null, 'DOMAIN_NODE');
const domainNameStore = new GlobalStore("", null, 'DOMAIN_NAME');
const domainsStore = new GlobalStore("", null, 'DOMAINS');

export const useCount = countStore.getHook();
export const useDomainNode = domainNodeStore.getHook();
export const useDomainName = domainNameStore.getHook();
export const useDomains = domainsStore.getHook();

export const usePersistedCount = () => {
  const [refresh, setter, state, isUpdated] = useCount();

  useEffect(() => {
    refresh();
  }, []);

	
  return [state, setter, isUpdated];
}

export const usePersistedDomainNode = () => {
  const [refresh, setter, state, isUpdated] = useDomainNode();

  useEffect(() => {
    refresh();
  }, []);

  return [state, setter, isUpdated];
}

export const usePersistedDomainName = () => {
  const [refresh, setter, state, isUpdated] = useDomainName();

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
