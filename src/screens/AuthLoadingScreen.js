import React from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../logic/actions';
import RNSecureStorage from 'rn-secure-storage';
import * as constants from '../logic/constants';
import TrackPlayer from 'react-native-track-player';
import * as Utils from '../logic/utils';
import * as api from '../logic/api';
import FirebaseService from '../logic/firestoreService';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentDidUpdate(prevProps) {
    const {configError, configData, configFetched} = this.props;

    if (!prevProps.configFetched && configFetched) {
      const {
        needUpdate,
        forceUpdate,
        changeLog,
        currentVersion,
      } = Utils.checkUpdate(configData);
      if (needUpdate) {
        this.props.showModal(
          {
            open: true,
            changeLog,
            currentVersion,
            closeable: !forceUpdate,
            closeModal: () => this.props.hideModal(true),
          },
          'update',
          true,
        );
        if (forceUpdate) return;
      }
      this.props.showPlayer();
      this.props.navigation.navigate('MainStack');
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    await FirebaseService.init();
    this.props.navigation.navigate('MainStack');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const {config} = state;
  const {
    error: configError,
    data: configData,
    isFetched: configFetched,
  } = config;
  return {configError, configData, configFetched};
}

function mapDispatchToProps(dispatch) {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    showPlayer: () => dispatch(actions.showPlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    fetchConfigData: () => dispatch(actions.fetchConfigData()),
    hideModal: forceHide => dispatch(actions.hideModal(forceHide)),
    showModal: (modalProps, modalType, alwaysShow) => {
      dispatch(actions.showModal({modalProps, modalType, alwaysShow}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
