import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/SplashScreen';


import ChartsScreen from '../screens/ChartsScreen';
import WalletScreen from '../screens/WalletScreen';
import InfoScreen from '../screens/InfoScreen';
import i18n from 'i18n-js';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({headerTitle: getHeaderTitle(route)});

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      activeBackgroundColor: '#424242',
      inactiveBackgroundColor: 'black',
      labelStyle: {
        fontSize: 14,
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomWidth: 3,
      }
    }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: i18n.t('tabHome'),
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-home"/>,
        }}
      />
      <BottomTab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: i18n.t('tabWallet'),
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-wallet"/>,
        }}
      />
      <BottomTab.Screen
        name="Chart"
        component={ChartsScreen}
        options={{
          title: i18n.t('tabChart'),
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-trending-up"/>,
        }}
      />
      <BottomTab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          title: i18n.t('tabInfo'),
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-info"/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Welcome!';
    case 'Wallet':
      return 'Wallet';
    case 'Chart':
      return 'Trading View';
    case 'Info':
      return 'Information';
  }
}

