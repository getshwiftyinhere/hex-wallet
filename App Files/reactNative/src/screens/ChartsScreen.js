import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

const url = 'https://uniswap.vision/?ticker=UniswapV2:HEXUSDC&interval=1D';

class ChartScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#black" barStyle="light-content"/>
          <WebView source={{uri: url}}/>
        </View>
      </SafeAreaView>
    );
  }
}

function handleExternalOpen() {
  WebBrowser.openBrowserAsync(url);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black"
  },
  container: {
    flex: 1
  }
});

export default ChartScreen;