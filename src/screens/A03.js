import React, {Component} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  Text,
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
import FirebaseConfig from '../logic/firebaseInfo';
import firebase from 'react-native-firebase';
const {THEME_CONFIG, USED_THEME} = constants;
const {backgroundColor} = THEME_CONFIG[USED_THEME];

const mockJSON = require("../Mock/category.json")

class A03 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getLibrary();
    console.log('====================================');
    console.log(mockJSON);
    console.log('====================================');
    // // if (!firebase.apps.length) {
    // firebase.initializeApp(FirebaseConfig);
    // // }
    // var docRef = firebase.firestore().collection('full_data');
    // docRef
    //   .where('category', 'array-contains', 'Children')
    //   .get()
    //   .then(snapshot => {
    //     if (snapshot.empty) {
    //       console.log('No matching documents.');
    //       return;
    //     }

    //     snapshot.forEach(doc => {
    //       console.log(JSON.stringify(doc.data()));
    //     });
    //   })
    //   .catch(err => {
    //     console.log('Error getting documents', err);
    //   });
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

  navToBookDetail = async data => {
    this.props.navigation.navigate('A10', {
      bookData: data,
    });
  };

  renderItem = data => {
    const {time} = this.props;
    // console.log('====================================');
    // console.log(data);
    // console.log('====================================');
    // return null
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

  render() {
    const {books, isDrawerOpen, isBottomSheetOpen} = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isDrawerOpen || isBottomSheetOpen ? 'no-hide-descendants' : 'auto'
        }>
        <View style={headerStyle.header}>
          <View style={headerStyle.titleWrap}>
            <Text style={headerStyle.title}>Sách của bạn</Text>
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
            accessibilityLabel="Tìm kiếm"
            onPress={() => this.props.navigation.navigate('A04')}
            style={headerStyle.btn}>
            <Icon name={'search'} size={20} color={'black'} />
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: 10, flex: 1, backgroundColor}}>
          <FlatList
            data={mockJSON}
            numColumns={2}
            refreshing={false}
            extraData={mockJSON}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => this.renderItem(item)}
            ListHeaderComponent={
              <Text style={styles.textHeader}>Thư viện</Text>
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const {playback, author, library, time, drawer, bottomSheet} = state;
  const {error: authorError} = author;
  const {books} = library;
  const {isOpen: isDrawerOpen} = drawer;
  const {isOpen: isBottomSheetOpen} = bottomSheet;
  return {
    authorError,
    playback,
    books,
    time,
    isDrawerOpen,
    isBottomSheetOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    getLibrary: () => dispatch(actions.getLibraryData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(A03);
