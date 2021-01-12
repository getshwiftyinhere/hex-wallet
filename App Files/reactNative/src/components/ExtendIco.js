import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function ExtendIco(props) {
  return (
    <View style={[styles.root, props.style]}>
      <View style={styles.extendIco1}>
        <View style={styles.boundingBox16}>
          <Svg viewBox="-0 -0 10.56478605488821 20" style={styles.iconColor2}>
            <Path
              strokeWidth={0}
              fill="rgba(60,6,94,1)"
              fillOpacity={1}
              strokeOpacity={1}
              d="M10.40 9.60 L0.97 0.17 C0.74 -0.06 0.39 -0.06 0.17 0.17 C-0.06 0.39 -0.06 0.74 0.17 0.97 L9.20 10.00 L0.17 19.03 C-0.06 19.25 -0.06 19.61 0.17 19.83 C0.28 19.94 0.42 20.00 0.56 20.00 C0.71 20.00 0.85 19.95 0.96 19.83 L10.40 10.40 C10.62 10.18 10.62 9.82 10.40 9.60 Z"
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
  extendIco1: {
    width: 24,
    height: 24,
    opacity: 1
  },
  boundingBox16: {
    width: 24,
    height: 24,
    backgroundColor: "transparent"
  },
  iconColor2: {
    width: 11,
    height: 20,
    backgroundColor: "transparent",
    borderColor: "transparent",
    marginTop: 2,
    marginLeft: 7
  }
});

export default ExtendIco;
