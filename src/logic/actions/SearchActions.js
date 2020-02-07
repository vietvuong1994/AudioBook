import {
  FETCH_SEARCH_DATA,
  FETCH_SEARCH_SUCCESS,
  FETCH_SEARCH_ERROR,
  REFRESH_SEARCH_DATA,
  CHANGE_SEARCH_TEXT,
} from './actionsTypes';
import * as api from '../../logic/api';
import FirebaseService from '../firestoreService';

const requestSearchData = () => {
  return {
    type: FETCH_SEARCH_DATA,
  };
};

const receiveSearchData = (items, lastId, isFetchedAllData) => {
  return {
    type: FETCH_SEARCH_SUCCESS,
    items,
    lastId,
    isFetchedAllData,
  };
};

const refreshSearchData = (items, lastId, isFetchedAllData) => {
  return {
    type: REFRESH_SEARCH_DATA,
    items,
    lastId,
    isFetchedAllData,
  };
};

const fetchSearchError = error => {
  return {
    type: FETCH_SEARCH_ERROR,
    error,
  };
};

export const changeSearchText = searchText => {
  return {
    type: CHANGE_SEARCH_TEXT,
    searchText,
  };
};

const getOnlineBook = async ({limit, lastId, category, refresh}) => {
  const onlineBook = await FirebaseService.getBookList({
    limit,
    category,
    lastId: !refresh ? lastId : null,
  });
  return onlineBook;
};

const fetchSearchData = ({ lastId, refresh}) => {
  return async (dispatch, getState) => {
    try {
      dispatch(requestSearchData());
      const {author, category, speaker, sponsor, search} = getState();
      const {activeFilter: authorFilter} = author;
      const {activeFilter: categoryFilter} = category;
      const {activeFilter: speakerFilter} = speaker;
      const {activeFilter: sponsorFilter} = sponsor;
      const searchText = search.searchText.trim();
      const limit = 10;
      const onlineBookData = await getOnlineBook({
        limit,
        lastId,
        category: categoryFilter,
        refresh,
        searchText
      });
      const {data: onlineBook, lastDoc} = onlineBookData;
      const isFetchedAllData = onlineBook.length < limit;
      const newLastId = onlineBook[onlineBook.length - 1]
        ? onlineBook[onlineBook.length - 1].book_id
        : null;
      if (refresh) {
        dispatch(receiveSearchData(onlineBook, newLastId, isFetchedAllData))
      } else {
        dispatch(refreshSearchData(onlineBook, newLastId, isFetchedAllData))
      }
    } catch (error) {
      dispatch(fetchSearchError(error));
    }
  };
};

const shouldFetchSearchData = (state, refresh) => {
  const {isFetching, error, isFetchedAllData} = state;
  const errorOnFetching = error && !refresh;
  const shouldFetch = !(isFetching || isFetchedAllData || errorOnFetching);
  return shouldFetch;
};

export const fetchSearchDataIfNeed = (refresh) => {
  return (dispatch, getState) => {
    const {search} = getState();
    const {lastId} = search;
    if (shouldFetchSearchData(search, refresh)) {
      return dispatch(fetchSearchData({ lastId, refresh}));
    }
  };
};
