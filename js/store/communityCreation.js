export const COMMUNITY_CREATE = 'COMMUNITY_CREATE';

export const setCommunityCreate = communityCreate => ({
    type: COMMUNITY_CREATE,
    communityCreate,
});

const initialState = {
    communityCreate: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case COMMUNITY_CREATE:
            return {
                ...state,
                communityCreate: action.communityCreate,
            };
        default:
            return state;
    }
};