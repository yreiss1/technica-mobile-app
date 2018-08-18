import React, { Component } from 'react';
import { DefaultTheme, BottomNavigation } from 'react-native-paper';
import Home from './screens/Home';
import Mentors from './screens/Mentors';
import Profile from './screens/Profile';
import Saved from './screens/Saved';
import Schedule from './screens/Schedule';
import CustomTabBar from './components/CustomTabBar';
import { H5 } from './components/Text';
import { colors } from './components/Colors';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { PushNotificationIOS } from 'react-native';
import Analytics from '@aws-amplify/analytics';
import aws_exports from './aws-exports';

import firebase from 'react-native-firebase';

const channelId = 'technica-push-notifications';
const channelName = 'Technica Announcements';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    // TODO DEPRECATE DEMO DATA
    this.state = {
      events: {
        1: {
          name: 'Lunch',
          description: 'Find your own lunch',
          location: 'Room 123',
          img: 'demo3',
          beginnerFriendly: false,
          startTime: undefined,
          savedCount: 555
        },
        2: {
          name: 'Dinner',
          description: 'Find your own lunch',
          location: 'Room 523',
          beginnerFriendly: true,
          img: 'demo1',
          time: undefined,
          savedCount: 999
        },
        4: {
          name: 'Batista Bombs',
          description: 'Find your own lunch',
          location: 'Room 13',
          beginnerFriendly: true,
          img: 'demo2',
          time: undefined,
          savedCount: 1
        },
        3: {
          name: 'Button Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo3',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 4
        },
        31: {
          name: 'Chicken Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo1',
          beginnerFriendly: false,
          time: undefined,
          savedCount: 41
        },
        32: {
          name: 'Burrito Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo2',
          beginnerFriendly: false,
          time: undefined,
          savedCount: 477
        },
        33: {
          name: 'Sushi Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo3',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 41
        },
        34: {
          name: 'Block Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo2',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 444
        }
      },
      userInfo: {
        uid: 123456789,
        name: 'Emma Stone',
        savedEvents: {
          1: true,
          4: true
        }
      }
    };
  }

  render() {
    Analytics.configure(aws_exports);

    //create notifications channel
    const channel = new firebase.notifications.Android.Channel(
      channelId,
      channelName,
      firebase.notifications.Android.Importance.Max
    ).setDescription(
      'Technica notification channel for delivering important announcements'
    );

    firebase.notifications().android.createChannel(channel);

    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('Permission enabled');
        } else {
          try {
            firebase.messaging().requestPermission();
          } catch (error) {
            console.log('Error authenticating', error);
          }
        }
      });

    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('fcm token: ', fcmToken);
        } else {
          console.log('no token');
        }
      });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.log('notification displayed', notification);
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        console.log('notification received', notification);
        notification.android.setChannelId(channelId);
        firebase.notifications().displayNotification(notification);
      });

    const notification = new firebase.notifications.Notification()
      .setNotificationId('notificationId')
      .setTitle('Hello world')
      .setBody('I love local notifications');

    notification.android
      .setChannelId(channelId)
      .android.setSmallIcon('ic_launcher');
    firebase.notifications().displayNotification(notification);

    return (
      <ScrollableTabView
        tabBarPosition="bottom"
        locked
        style={{ backgroundColor: colors.black }}
        renderTabBar={() => <CustomTabBar />}
      >
        <Home
          masterState={this.state}
          eventManager={eventManager}
          tabLabel="home"
        />
        <Schedule
          masterState={this.state}
          tabLabel="calendar"
          eventManager={this.props.eventManager}
        />
        <Saved masterState={this.state} tabLabel="heart" />
        <Mentors masterState={this.state} tabLabel="people" />
        <Profile masterState={this.state} tabLabel="user" />
      </ScrollableTabView>
    );
  }
}
