import React from "react";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {ScrollView, View, ImageBackground, Text, TouchableOpacity, Image} from "react-native";
import i18n from 'i18n-js';
import styles from '../styles/style'
import btnStyles from '../styles/btnStyle'

export default class Onboarding extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <ScrollView style={styles.scrollView}>
          <MaterialCommunityIconsIcon
            name="arrow-left"
            style={styles.backIcon}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.contentView}>
            <Text style={styles.title}>
              {i18n.t('onboardingTitle')}
            </Text>
            <Image
              source={require("../assets/images/onboarding.png")}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.description}>
              {i18n.t('onboardingTxt')}
            </Text>
            <View style={styles.mainBtn}>
              <TouchableOpacity style={btnStyles.rect} onPress={() => this.props.navigation.navigate('Onboarding2')}>
                <ImageBackground
                  style={btnStyles.buttonColor1}
                  imageStyle={btnStyles.buttonColor1_imageStyle}
                  source={require("../assets/images/button_bg.png")}>
                  <Text style={btnStyles.homeScreen}> {i18n.t('nextBtn')}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/images/bg.png")}
        />
      </View>
    );
  }
}
