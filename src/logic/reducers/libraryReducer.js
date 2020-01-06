import { FETCH_LIBRARY_SUCCESS } from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  books: [],
  error: null,
  lastId: null,
  isFetchedAllData: false
};

function libraryReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_LIBRARY_SUCCESS:
      return {
        books: action.books
      };

    default:
      return state;
  }
}

export default libraryReducer;
