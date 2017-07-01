
export type Action =
      { type: 'OPEN_DRAWER'}  | { type: 'CLOSE_DRAWER'}
    | { type: 'LOGGED_IN', source: ?string; data: { id: string; name: string; sharedSchedule: ?boolean; } }
    | { type: 'RESTORED_SCHEDULE', list: Array<ParseObject> }
    | { type: 'SKIPPED_LOGIN' }
    | { type: 'LOGGED_OUT' };


export type Dispatch = (action:Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;

export const SET_LOGIN_DETAILS = 'SET_LOGIN_DETAILS'
export const SET_CALENDAR_ITEMS = 'SET_CALENDAR_ITEMS'
