import {
  FETCH_LIBRARY,
  FETCH_LIBRARY_SUCCESS,
  FETCH_LIBRARY_ERROR,
} from './actionsTypes';
import openConnection from '../realm';

const getLocalBooks = async () => {
  const realm = await openConnection();
  return realm.objects('Book').filtered(`isDownloaded = true`);
};

const getOnlineBook = async () => {
  
}

const fetchLibraryData = (limit, lastId, category, refresh ) => {
  return async dispatch => {
    const localBooks = await getLocalBooks();
    if (localBooks.length == 0) {
      dispatch({
        type: FETCH_LIBRARY_SUCCESS,
        books,
        isFetchedAllData: false,
      });
    } else {
      dispatch({
        type: FETCH_LIBRARY_SUCCESS,
        books: localBooks,
        isFetchedAllData: true,
      });
    }
  };
};

const shouldFetchLibrary = (state, limit, category, refresh) => {
  const {isFetching, error, lastId, isFetchedAllData} = state;
  const errorOnFetching = error && !refresh;
  return async dispatch => {
    if (isFetching || isFetchedAllData || errorOnFetching) {
      return;
    } else {
      dispatch(fetchLibraryData(limit, lastId, category, refresh));
    }
  };
};

export const getLibraryData = (limit, category = null, refresh = false) => {
  return async (dispatch, getState) => {
    const {library} = getState();
    dispatch(shouldFetchLibrary(library, limit, category, refresh));
  };
};
