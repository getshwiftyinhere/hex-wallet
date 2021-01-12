import {Dimensions} from "react-native";

module.exports = {
  root: {
    flex: 1,
    backgroundColor: "#230555"
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
  tourView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40
  },
  image: {
    flex: 1,
    marginVertical: "5%",
    height: 200,
    backgroundColor: "transparent",
    opacity: 1,
  },
  backIcon: {
    top: 10,
    marginVertical: 20,
    marginLeft: 15,
    color: "white",
    fontSize: 40
  },
  imageBackground: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  title: {
    flex: 1,
    marginHorizontal: "5%",
    color: "white",
    fontSize: 24,
    fontFamily: "palanquin-700",
    lineHeight: 32,
    textAlign: "center"
  },
  subtitle: {
    flex: 1,
    marginHorizontal: "5%",
    color: "white",
    fontSize: 20,
    fontFamily: "palanquin-700",
    lineHeight: 24,
    textAlign: "center"
  },
  description: {
    flex: 1,
    marginHorizontal: "5%",
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 14,
    fontFamily: "palanquin-500",
    lineHeight: 20,
    textAlign: "justify",
    top: 20
  },
  mainBtn:{
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20
  },
  hexLogo: {
    top: 40,
    right: 10,
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  pageTitle: {
    top: 50,
    backgroundColor: "transparent",
    color: "white",
    position: "absolute",
    width: "100%",
    opacity: 1,
    fontSize: 16,
    fontFamily: "palanquin-700",
    lineHeight: 20,
    textAlign: "left",
    left: 20,
  },
};