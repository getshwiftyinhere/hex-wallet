import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import BitcoinLogoIco from "./BitcoinLogoIco";

function WalletListItem(props) {
  return (
    <View style={[styles.root, props.style]}>
      <View style={styles.listItem4}>
        <View style={styles.bitcoinLogoIco2Row}>
          <BitcoinLogoIco style={styles.bitcoinLogoIco2}></BitcoinLogoIco>
          <View style={styles.coinName1Column}>
            <Text style={styles.coinName1}>Coin name</Text>
            <Text style={styles.coinSymbol1}>Coin symbol</Text>
          </View>
          <View style={styles.value3Column}>
            <Text style={styles.value3}>$ value</Text>
            <Text style={styles.coinValue}>Coin value</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  listItem4: {
    width: 303,
    height: 33,
    opacity: 1,
    marginTop: 7,
    marginLeft: 12
  },
  bitcoinLogoIco2: {
    width: 32,
    height: 32,
    backgroundColor: "transparent",
    opacity: 1,
    marginTop: 1
  },
  coinName1: {
    backgroundColor: "transparent",
    color: "rgba(19,0,82,1)",
    opacity: 1,
    fontSize: 14,
    fontFamily: "palanquin-700",
    lineHeight: 16
  },
  coinSymbol1: {
    backgroundColor: "transparent",
    color: "rgba(123,123,123,1)",
    opacity: 1,
    fontSize: 12,
    fontFamily: "palanquin-regular",
    lineHeight: 16,
    marginTop: 1
  },
  coinName1Column: {
    width: 67,
    marginLeft: 12
  },
  value3: {
    backgroundColor: "transparent",
    color: "rgba(19,0,82,1)",
    opacity: 1,
    fontSize: 14,
    fontFamily: "palanquin-700",
    lineHeight: 16,
    textAlign: "right",
    marginLeft: 8
  },
  coinValue: {
    backgroundColor: "transparent",
    color: "rgba(176,0,190,1)",
    opacity: 1,
    fontSize: 12,
    fontFamily: "palanquin-regular",
    lineHeight: 16,
    textAlign: "right",
    marginTop: 1
  },
  value3Column: {
    width: 54,
    marginLeft: 138
  },
  bitcoinLogoIco2Row: {
    height: 33,
    flexDirection: "row"
  }
});

export default WalletListItem;
