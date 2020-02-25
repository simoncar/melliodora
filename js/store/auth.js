
// ACTIONS
export const SET_USER_INFO = 'SET_USER_INFO';

export const setUserInfo = userInfo => ({
    type: SET_USER_INFO,
    userInfo,
});

const initialState = {
    user: false,
};

// REDUCER
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        default:
            return state;
    }
};