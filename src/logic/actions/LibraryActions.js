import {
  FETCH_LIBRARY,
  FETCH_LIBRARY_SUCCESS,
  FETCH_LIBRARY_ERROR,
} from './actionsTypes';
import openConnection from '../realm';
import FirebaseService from '../firestoreService';

const fetchLibrary = () => {
  return {
    type: FETCH_LIBRARY,
  };
};

const fetchLibraryFail = error => {
  return {
    type: FETCH_LIBRARY_ERROR,
    error,
  };
};

const getLocalBooks = async () => {
  const realm = await openConnection();
  return realm.objects('Book')
};

const getOnlineBook = async ({limit, lastId, category, refresh}) => {
  const onlineBook = await FirebaseService.getBookList({
    limit,
    category,
    lastId: !refresh ? lastId : null,
  });
  return onlineBook;
};

const fetchLibraryData = (limit, lastId, category, refresh) => {
  return async dispatch => {
    try {
      dispatch(fetchLibrary());
      const localBooks = await getLocalBooks();
      if (localBooks.length == 0) {
        const onlineBookData = await getOnlineBook({
          limit,
          lastId,
          category,
          refresh,
        });
        const {data: onlineBook, lastDoc} = onlineBookData;
        dispatch({
          type: FETCH_LIBRARY_SUCCESS,
          books: onlineBook,
          isFetchedAllData: onlineBook.length < limit,
          lastId: onlineBook[onlineBook.length - 1]
            ? onlineBook[onlineBook.length - 1].book_id
            : null,
          // lastId: lastDoc ? lastDoc : null,
          refresh,
        });
      } else {
        dispatch({
          type: FETCH_LIBRARY_SUCCESS,
          books: localBooks,
          isFetchedAllData: true,
          lastId: null,
          refresh: true,
        });
      }
    } catch (e) {
      dispatch(fetchLibraryFail(e));
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
