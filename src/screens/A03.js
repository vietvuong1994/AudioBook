import React, {Component} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import styles from './styles/A03Style';
import {DrawerActions} from 'react-navigation';
import headerStyle from '../components/styles/A03HeaderStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import A03Item from '../components/A03Item';
import * as actions from '../logic/actions';
import {connect} from 'react-redux';
import RNSecureStorage from 'rn-secure-storage';
import * as constants from '../logic/constants';
import FirebaseService from '../logic/firestoreService';
// const {THEME_CONFIG, USED_THEME} = constants;
// const {backgroundColor} = THEME_CONFIG[USED_THEME];

class A03 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookData: [],
    };
  }

  componentDidMount() {
    // this.props.getLibrary(10, 'Children', true);
    // this.getListBook();
  }

  componentDidUpdate(prevProps) {
    const {authorError} = this.props;
    if (prevProps.authorError == null && authorError) {
      __DEV__ && console.log('A03 not authen: ', authorError);
      this.signOut();
    }
  }

  signOut = async () => {
    try {
      await RNSecureStorage.remove(constants.AS_AUTHORIZATION);
      this.props.hidePlayer();
      await TrackPlayer.reset();
      this.props.navigation.navigate('AuthStack');
      this.props.updatePlayback(null);
      const authorization = await RNSecureStorage.get(
        constants.AS_AUTHORIZATION,
      );
      console.log('AUTHEN TOKEN AFTER REMOVE: ', authorization);
    } catch (e) {
      __DEV__ && console.log('error signout: ', e);
    }
  };

  getListBook = async () => {
    try {
      const bookData = await FirebaseService.getBookList({
        limit: 10,
        category: 'Children',
      });
      this.setState({bookData});
    } catch (e) {
      __DEV__ && console.log('get book data: ', e);
    }
  };
  navToBookDetail = async data => {
    this.props.navigation.navigate('A10', {
      bookData: data,
    });
  };

  renderItem = data => {
    const {time} = this.props;
    return (
      <A03Item
        data={data}
        onPress={() => this.navToBookDetail(data)}
        timeRead={time}
      />
    );
  };

  openDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  handleLoadMore(isFetching) {
    if (!isFetching) {
      this.props.getLibrary(10, 'Children', false);
    }
  }

  renderFooter = (data, isFetching, error) => {
    if (isFetching) {
      return (
        <ActivityIndicator
          size={'large'}
          style={{color: '#000', marginVertical: 10}}
        />
      );
    } else if (!isFetching && data && data.length === 0) {
      return (
        <View>
          <Text style={{color: 'red', alignSelf: 'center', marginVertical: 10}}>
            No result was found!
          </Text>
        </View>
      );
    } else if (error) {
      return (
        <View>
          <Text style={{color: 'red', alignSelf: 'center', marginVertical: 10}}>
            Some error happen!
          </Text>
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      books: bookData,
      isDrawerOpen,
      isBottomSheetOpen,
      isFetchingLibrary,
      errorLibrary,
    } = this.props;
    // const {bookData} = this.state;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isDrawerOpen || isBottomSheetOpen ? 'no-hide-descendants' : 'auto'
        }>
        <View style={headerStyle.header}>
          <View style={headerStyle.titleWrap}>
            <Text style={headerStyle.title}>Your Books</Text>
          </View>
          <TouchableOpacity
            onPress={this.openDrawer}
            accessible={true}
            accessibilityLabel="Menu"
            style={headerStyle.btn}>
            <Icon name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Search..."
            onPress={() => this.props.navigation.navigate('A04')}
            style={headerStyle.btn}>
            <Icon name={'search'} size={20} color={'black'} />
          </TouchableOpacity>
        </View>

        <View
          style={{paddingHorizontal: 10, flex: 1, backgroundColor: '#F6F9FA'}}>
            <TouchableOpacity onPress={() => this.props.getLibrary(null, null ,null)}>
              <Text>getBookData</Text>
            </TouchableOpacity>
          {/* <FlatList
            data={bookData}
            numColumns={2}
            refreshing={false}
            extraData={bookData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => this.renderItem(item)}
            ListHeaderComponent={<Text style={styles.textHeader}>Library</Text>}
            ListFooterComponent={() =>
              this.renderFooter(bookData, isFetchingLibrary, errorLibrary)
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => this.handleLoadMore(isFetchingLibrary)}
          /> */}
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const {playback, author, library, time, drawer, bottomSheet} = state;
  const {error: authorError} = author;
  const {books, isFetching: isFetchingLibrary, error: errorLibrary} = library;
  const {isOpen: isDrawerOpen} = drawer;
  const {isOpen: isBottomSheetOpen} = bottomSheet;
  return {
    authorError,
    playback,
    books,
    time,
    isDrawerOpen,
    isBottomSheetOpen,
    isFetchingLibrary,
    errorLibrary,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    getLibrary: (limit, category, refresh) =>
      dispatch(actions.getLibraryData(limit, category, refresh)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(A03);
