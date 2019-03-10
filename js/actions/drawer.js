
import type { Action } from './types';

export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export function openDrawer():Action {
console.log ('OPEN_DRAWER');
  return {
    type: OPEN_DRAWER,
  };
}

export function closeDrawer():Action {
  return {
    type: CLOSE_DRAWER,
  };
}
