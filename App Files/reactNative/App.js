import 'react-native-gesture-handler';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

//navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

//screens
import IntroScreen from './src/screens/SplashScreen';
import Onboarding from './src/screens/Onboarding';
import Onboarding2 from './src/screens/Onboarding2';
import Onboarding3 from './src/screens/Onboarding3';
import useLinking from './src/navigation/useLinking';

//translations
require("./src/js/translations.js");

const Stack = createStackNavigator();


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
          'palanquin-600': require('./src/assets/fonts/palanquin-600.ttf'),
          'palanquin-700': require('./src/assets/fonts/palanquin-700.ttf'),
          'palanquin-500': require('./src/assets/fonts/palanquin-500.ttf'),
          'palanquin-regular': require('./src/assets/fonts/palanquin-regular.ttf'),
          'roboto-regular': require('./src/assets/fonts/roboto-regular.ttf'),
          'roboto-700': require('./src/assets/fonts/roboto-700.ttf'),
        });

      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" backgroundColor="#424242"/>}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}  >
          <Stack.Navigator  screenOptions={{
            headerShown: false,
            animationEnabled:true,
            gestureEnabled:true,
            swipeEnabled:true
          }}>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Onboarding2" component={Onboarding2} />
            <Stack.Screen name="Onboarding3" component={Onboarding3} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth:"100%",
    minHeight:"100%",
    flex: 1,
    backgroundColor: '#424242',
    fontFamily: "palanquin-700"
  },
});

