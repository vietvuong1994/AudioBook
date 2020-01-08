import {
  FETCH_LIBRARY,
  FETCH_LIBRARY_SUCCESS,
  FETCH_LIBRARY_ERROR,
} from '../actions/actionsTypes';

const initState = {
  isFetching: false,
  books: [],
  error: null,
  lastId: null,
  isFetchedAllData: false,
};

function libraryReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_LIBRARY:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_LIBRARY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        books: action.refresh
          ? action.books
          : [...state.books, ...action.books],
        lastId: action.lastId,
        isFetchedAllData: action.isFetchedAllData,
      };
    case FETCH_LIBRARY_ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export default libraryReducer;
