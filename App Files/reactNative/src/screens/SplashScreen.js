import React, {Component} from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import Svg, {Path, Stop, Defs, LinearGradient} from "react-native-svg";

import i18n from 'i18n-js';

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <ImageBackground style={styles.background} source={require("../assets/images/bg.png")}>
        </ImageBackground>
        <View style={styles.centerBox}>
          <Image
            source={require("../assets/images/hex-wallet.png")}
            resizeMode="contain"
            style={styles.hexLogo}
          ></Image>
           <View style={styles.row}>
            <Text style={styles.hexText}>
            <Image
              source={require("../assets/images/hex-logo.png")}
              resizeMode="contain"
              style={styles.hexLogoSmall}
            ></Image>
            {i18n.t('hexTitleHome')}
          </Text>
          </View>
          <Text style={styles.yourBlockchainWallet}>
            {i18n.t('splashTxt')}
          </Text>
          <View style={styles.mainBtn}>
            <TouchableOpacity style={btnStyles.rect} onPress={() => this.props.navigation.navigate('Onboarding')}>
              <ImageBackground
                style={btnStyles.buttonColor1}
                imageStyle={btnStyles.buttonColor1_imageStyle}
                //source={require("")}
                >
                <Text style={btnStyles.homeScreen}> {i18n.t('learnBtn')}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const btnStyles = StyleSheet.create({
  rect: {
    width: "100%",
    height: 48,
    opacity: 1
  },
  buttonColor1: {
    width: "100%",
    color: "white",
    height: 48,
    backgroundColor: "black",
    borderRadius: 10,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: "rgba(0,0,0,0.3025568181818182)",
    shadowOpacity: 1,
    shadowRadius: 8,
    overflow: "hidden"
  },
  buttonColor1_imageStyle: {
    opacity: 1
  },
  homeScreen: {
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 15,
    fontFamily: "palanquin-700"
  }
});
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(235,236,240,1)",
    width: "100%",
    alignItems: 'center', // Centered hor
  },
  centerBox: {
    maxWidth: 500,
    width: "100%",
    justifyContent: 'center', //Centered ver
    alignItems: 'center', // Centered hor
    textAlignVertical: 'center',
    flex: 1
  },
  background: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 1
  },
  yourBlockchainWallet: {
    width: "90%",
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 14,
    fontFamily: "palanquin-500",
    textAlign: "center",
    marginBottom: 25
  },
  hexText: {
    alignSelf:"center",
    
    color: "white",
    fontSize: 50,
    letterSpacing:1,
    fontFamily: "palanquin-700",
  },
  hexLogo: {
    height: "25%"
  },
  hexLogoSmall: {
    height:50,
    width:50,
    marginTop:25
  },
  mainBtn: {
    width: "70%",
    fontFamily: "palanquin-700",
  },
  row: {
    width:"100%",
    flexDirection: "column",
  },
});
