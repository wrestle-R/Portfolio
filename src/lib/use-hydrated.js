import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function useHydrated() {
  return useSyncExternalStore(subscribe, clientReady, serverReady);
}
