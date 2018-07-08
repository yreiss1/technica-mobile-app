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
          time: undefined,
          savedCount: 555,
        },
        2: {
          name: 'Dinner',
          description: 'Find your own lunch',
          location: 'Room 523',
          beginnerFriendly: false,
          img: 'demo1',
          time: undefined,
          savedCount: 999,
        },
        4: {
          name: 'Batista Bombs',
          description: 'Find your own lunch',
          location: 'Room 13',
          beginnerFriendly: true,
          img: 'demo2',
          time: undefined,
          savedCount: 1,
        },
        3: {
          name: 'Button Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo3',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 4,
        },
        31: {
          name: 'Chicken Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo1',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 41,
        },
        32: {
          name: 'Burrito Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo2',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 477,
        },
        33: {
          name: 'Sushi Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo3',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 41,
        },
        34: {
          name: 'Block Making',
          description: 'Find your own lunch',
          location: 'Room 3',
          img: 'demo2',
          beginnerFriendly: true,
          time: undefined,
          savedCount: 444,
        },
      },
      userInfo: {
        uid: 123456789,
        name: 'Emma Stone',
        savedEvents: {
          1: true,
          4: true,
        },
      },
    };
  }

  render() {
    return (
      <ScrollableTabView
        tabBarPosition="bottom"
        locked
        style={{ backgroundColor: colors.black}}
        renderTabBar={() => <CustomTabBar />}
      >
        <Home masterState={this.state} tabLabel="home" />
        <Schedule masterState={this.state} tabLabel="calendar" />
        <Saved masterState={this.state} tabLabel="heart" />
        <Mentors masterState={this.state} tabLabel="people" />
        <Profile masterState={this.state} tabLabel="user" />
      </ScrollableTabView>
    );
  }
}
