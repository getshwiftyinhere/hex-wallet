import React from "react";
import { StyleSheet, View } from "react-native";
import '../../global'
import WalletProvider from '../components/EthereumProvider'
import Wallet from '../components/Wallet';

export default class WalletScreen extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <WalletProvider>
          <Wallet/>
        </WalletProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#424242"
  },
  icon: {
	  top: 35,
	  left: "4%",
	  position: "absolute",
	  color: "rgba(134,134,134,1)",
    fontSize: 40,
    zIndex: 999
	}
});