
export type Action =
  ( { type: 'OPEN_DRAWER'}  | { type: 'CLOSE_DRAWER'} );

export type Dispatch = (action:Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;

export const SET_LOGIN_DETAILS = 'SET_LOGIN_DETAILS'
