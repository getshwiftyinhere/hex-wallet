import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function ReturnIco(props) {
  return (
    <View style={[styles.root, props.style]} >
      <View style={styles.rect}>
        <View style={styles.boundingBox1}>
          <Svg viewBox="-0 -0 24 19.86206896551724" style={styles.iconColor1}>
            <Path
              strokeWidth={0}
              fill="rgba(117,126,149,1)"
              fillOpacity={1}
              strokeOpacity={1}
              d="M3.05 8.94 L10.69 1.71 C11.09 1.33 11.11 0.71 10.72 0.31 C10.34 -0.09 9.71 -0.10 9.31 0.27 L0.59 8.53 C0.21 8.90 0.00 9.40 0.00 9.93 C0.00 10.46 0.21 10.96 0.60 11.35 L9.31 19.59 C9.50 19.77 9.75 19.86 10.00 19.86 C10.26 19.86 10.53 19.76 10.72 19.55 C11.11 19.16 11.09 18.53 10.69 18.15 L3.02 10.92 L23.00 10.92 C23.55 10.92 24.00 10.48 24.00 9.93 C24.00 9.38 23.55 8.94 23.00 8.94 Z"
            ></Path>
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  rect: {
    width: 24,
    height: 24,
    opacity: 1
  },
  boundingBox1: {
    width: 24,
    height: 24,
    backgroundColor: "transparent"
  },
  iconColor1: {
    width: 24,
    height: 20,
    color:"white",
    backgroundColor: "transparent",
    borderColor: "transparent",
    marginTop: 2
  }
});

export default ReturnIco;
