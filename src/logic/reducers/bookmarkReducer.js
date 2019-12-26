import {
  FETCH_LIST_BOOKMARK_DATA,
  FETCH_LIST_BOOKMARK_ERROR,
  FETCH_LIST_BOOKMARK_SUCCESS,
  REFRESH_LIST_BOOKMARK_DATA,
  DELETE_BOOKMARK_SUCCESS
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0
};
function bookmarkReducer(state = initState, action) {
  const currentItems = state.items;
  switch (action.type) {
    case FETCH_LIST_BOOKMARK_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_LIST_BOOKMARK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...currentItems, ...action.items],
        nextPage: action.nextPage,
        error: null
      };
    case REFRESH_LIST_BOOKMARK_DATA:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_LIST_BOOKMARK_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}

export default bookmarkReducer;
