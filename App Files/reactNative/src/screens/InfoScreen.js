import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  RefreshControl,
  Switch,
  ScrollView,
} from 'react-native'
import * as Linking from 'expo-linking'
import {SettingsScreen, SettingsData, Chevron} from 'react-native-settings-screen'
import i18n from 'i18n-js';
import style from "../styles/style";
import styles2 from "../styles/walletStyle2";
import { expo } from '../../app.json';

const fontFamily = 'palanquin-600';

export default class SettingScreen extends React.Component {
  state = {
    refreshing: false,
  }

  openUrl(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  settingsData: SettingsData = [
    // {
    //   type: 'CUSTOM_VIEW',
    //   key: 'hero',
    //   render: renderHero
    // },
    {
      type: 'SECTION',
      header: i18n.t('settingsInfoTitle'),
      rows: [
        {
          title: i18n.t('settingsInfoItem'),
          showDisclosureIndicator: true,
          onPress: () => {this.openUrl('https://hex.com')}
        },
        {
          title: i18n.t('settingsInfoBuyEth'),
          showDisclosureIndicator: true,
          onPress: () => {this.openUrl('https://www.coinbase.com/join/593523168a9af501805a5e6d')}
        },
        /*
        {
          title: 'Introduction',
          showDisclosureIndicator: true,
          onPress: () => {this.props.navigation.navigate('Onboarding')}
        },
        {
          title: 'Mint & Secure Deposits',
          showDisclosureIndicator: true,
          onPress: () => {this.props.navigation.navigate('Onboarding2')}
        },
        {
          title: 'Analyze & Track Deposits',
          showDisclosureIndicator: true,
          onPress: () => {this.props.navigation.navigate('Onboarding3')}
        },
        {
          title: 'Why do I need a Wallet?',
          showDisclosureIndicator: true,
          onPress: () => {this.props.navigation.navigate('WhyWallet')}
        },
        {
          title: 'What is HEX Money?',
          showDisclosureIndicator: true,
          onPress: () => {this.props.navigation.navigate('HXYScreen')}
        },
         */
      ],
    },
    {
      type: 'SECTION',
      header: i18n.t('settingsJoinCommunityTitle'),
      rows: [
        {
          title: i18n.t('settingsJoinCommunityItem1'),
          showDisclosureIndicator: true,
          onPress: () => {this.openUrl('https://t.me/hexcrypto')}
        },
        {
          title: i18n.t('settingsJoinCommunityItem2'),
          showDisclosureIndicator: true,
          onPress: () => {this.openUrl('https://twitter.com/hexcrypto')}
        },
      ],
    },
    {
      type: 'SECTION',
      header: i18n.t('settingsHelpTitle'),
      rows: [
        {
          title: i18n.t('settingsHelpItem'),
          style: backgroundColor="black",
          showDisclosureIndicator: true,
          onPress: () => {this.openUrl('https://t.me/hexwalletsupport')}
        },
        {
          title: i18n.t('settingsHelpDonate'),
          style: backgroundColor="black",
          showDisclosureIndicator: true,
          onPress: () => {this.openUrl('https://etherscan.io/address/0x2893951ba47ed5b9Ef068C288b78d73681D499b6')}
        },
      ]
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            color: 'white',
            marginBottom: 40,
            marginTop: -30,
            fontFamily,
          }}
        >
          v { expo.version }
        </Text>
      ),
    },
  ]

  render() {
    return (
      <ScrollView style={styles2.container}>
        <Image style={styles2.background} source={require("../assets/images/bg.png")} />
        <Text style={style.pageTitle}>
          {i18n.t('tabSettings')}
        </Text>
        <Image
          source={require("../assets/images/hex-logo.png")}
          resizeMode="contain"
          style={style.hexLogo}
        />
        <View style={styles.container}>
          <SettingsScreen
            style={styles.settingsCont}
            data={this.settingsData}
            globalTextStyle={{fontFamily}}
            scrollViewProps={{
              refreshControl: (
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => {
                    this.setState({refreshing: true})
                    setTimeout(() => this.setState({refreshing: false}), 3000)
                  }}
                />
              ),
            }}
          />
        </View>
      </ScrollView>
    )
  }
}

const statusBarHeight = Platform.OS === 'ios' ? 35 : 0

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    backgroundColor: '#424242'
  },
  settingsCont: {
    backgroundColor:"#424242"
  },
  navBar: {
    backgroundColor: 'transparent',
    height: 44 + statusBarHeight,
    alignSelf: 'stretch',
    paddingTop: statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitle: {
    color: 'white',
    fontFamily,
    fontSize: 17,
  },
  heroContainer: {
    marginTop: 40,
    marginBottom: 50,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    flexDirection: 'row',
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'black',
    marginHorizontal: 20,
  },
  heroTitle: {
    fontFamily,
    color: 'black',
    fontSize: 24,
  },
  heroSubtitle: {
    fontFamily,
    color: '#999',
    fontSize: 14,
  },
})