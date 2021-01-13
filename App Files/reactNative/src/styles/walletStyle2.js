import {Platform} from "react-native";

module.exports = {
  container: {
    flex: 1,
    height: "100%",
    minHeight: "100%",
    backgroundColor: '#424242'
  },
  background: {
    top: 0,
    left: 0,
    width: "100%",
    height: 250,
    position: "absolute",
    opacity: 1
  },
  centerBox: {
    marginTop: 70,
    height: "100%",
    maxWidth: 500,
    width: "100%",
    justifyContent: 'center', //Centered ver
    alignItems: 'center', // Centered hor
    textAlignVertical: 'center',
    flex: 1
  },
  walletCenterBox: {
    marginTop: 110,
    height: "100%",
    maxWidth: 500,
    width: "100%",
    justifyContent: 'center', //Centered ver
    alignItems: 'center', // Centered hor
    textAlignVertical: 'center',
    flex: 1
  },
  account: {
    width: "100%",
    fontFamily: "palanquin-700",
    fontSize: 28,
    color: "white"
  },
  address: {
    width: "100%",
    fontFamily: "palanquin-700",
    fontSize: 18,
    color: "white"
  },
  pickerCont: {
    width: "100%",
  },
  picker: {
    width: 50,
    height: 50,
    top: -14,
    left: 15,
    position: "absolute",
    color:"black",
    opacity: Platform.OS === 'ios' ? 0 : 1
  },
  pickerArrow: {
    color: "white"
  },
  balance: {
    width: "100%",
    marginLeft: 5,
    fontFamily: "palanquin-700",
    fontSize: 20,
    color:"white"
  },
  balanceUsd: {
    width: "100%",
    marginLeft: 5,
    top:-5,
    fontFamily: "palanquin-700",
    fontSize: 16,
    color:"white"
  },
  balanceUpdate: {
    width: "100%",
    marginLeft: 5,
    fontFamily: "palanquin-700",
    fontSize: 14,
    marginTop: -5,
    marginBottom: -10
  },
  transactionView: {
    width: 50,
    fontFamily: "palanquin-700",
    fontSize: 14,
    color: "white",
    left: "45%",
    top: 55,
    position: "absolute"
  },
  mnemonicView: {
    width: 50,
    fontFamily: "palanquin-700",
    fontSize: 14,
    color: "white",
    left: "52%",
    top: 55,
    position: "absolute"
  },
  privateKeyView: {
    width: 50,
    fontFamily: "palanquin-700",
    fontSize: 14,
    color: "white",
    left: "45%",
    top: 20,
    position: "absolute"
  },
  stakeView: {
    left: "75%",
    top: 5,
    fontFamily: "palanquin-700",
    fontSize: 14,
    color: "white",
  },
  phraseCont: {
    width: "100%",
    justifyContent: 'center', //Centered hor
    marginTop: 10,
    marginBottom: 10
  },
  phraseRow: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    margin: 2
  },
  phraseBox: {
    height: "100%",
    width: "40%",
    marginLeft: "7%",
    borderColor: "rgba(128,128,128,1)",
    borderWidth: 2,
    borderRadius: 10,
  },
  phraseText: {
    opacity: 1,
    fontSize: 16,
    fontFamily: "palanquin-700",
    color: "white",
    marginLeft: 5
  },
  phraseNum: {
    opacity: 1,
    fontSize: 14,
    fontFamily: "palanquin-500",
    color: "white",
    textAlign: "right",
    right: 5,
    position: "absolute",
    width: "100%"
  },
  phraseTextInput: {
    opacity: 1,
    fontSize: 16,
    fontFamily: "palanquin-700",
    color: "white",
    marginLeft: 10,
    width: "80%",
    height: "100%",
  },
  walletSetUp: {
    top: 38,
    left: "5%",
    width: "90%",
    color: "white",
    position: "absolute",
    opacity: 1,
    fontSize: 16,
    fontFamily: "palanquin-700",
    lineHeight: 20,
    textAlign: "right"
  },
  returnIco: {
    top: 38,
    left: 23,
    width: 23,
    height: 22,
    backgroundColor: "transparent",
    position: "absolute",
    opacity: 1
  },
  walletCreationProc: {
    width: "90%",
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 24,
    fontFamily: "palanquin-700",
    lineHeight: 32,
    textAlign: "center"
  },
  functionTitle: {
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 24,
    fontFamily: "palanquin-700",
    textAlign: "center",
    marginHorizontal: 5
  },
  subFunctionTitle: {
    width: "90%",
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 20,
    fontFamily: "palanquin-700",
    lineHeight: 32,
    paddingTop: 10,
    textAlign: "center",
    marginBottom: 10
  },
  walletQrTitle: {
    width: "90%",
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 24,
    fontFamily: "palanquin-700",
    lineHeight: 32,
    textAlign: "center",
    marginBottom: 10
  },
  cameraQrTitle: {
    width: "90%",
    marginLeft: "5%",
    backgroundColor: "transparent",
    color: "white",
    textShadowColor: "black",
    textShadowRadius: 5,
    opacity: 1,
    fontSize: 24,
    fontFamily: "palanquin-700",
    lineHeight: 32,
    textAlign: "center",
    top: "10%",
  },
  art: {
    height: 150,
    backgroundColor: "transparent",
    opacity: 1
  },
  hexLogo: {
    top: 66,
    right: "4%",
    width: 84,
    height: 100,
    backgroundColor: "transparent",
    position: "absolute",
    opacity: 1,
  },
  prepareToRecordTh: {
    width: "90%",
    backgroundColor: "transparent",
    color: "white",
    opacity: 1,
    fontSize: 14,
    fontFamily: "palanquin-500",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 5
  },
  rect: {
    width: "100%",
    height: 48,
    opacity: 1
  },
  buttonColor1: {
    width: "70%",
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
  
  },
  homeScreen: {
    opacity: 1,
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    marginTop: 16,
    fontFamily: "palanquin-700",
    color:"white",
    width:"100%",
    textAlign:"center"
  },
  createBtn: {
    width: "70%",
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
    overflow: "hidden",
    marginTop:25,
    marginBottom:25
  },
  mainBtn: {
    width: "70%",
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
  
  titleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10
  },
  titleImage: {
    width: 50,
    height: 50,
    justifyContent: "space-around",
    alignItems: "center"
  },
  endStakeBtn: {
    width: "95%",
    marginLeft: "2.5%",
    color: "white",
    height: 48,
    backgroundColor: "orange",
    borderRadius: 10,
    overflow: "hidden"
  },
  endStakeBtnText: {
    width: "100%",
    fontFamily: "palanquin-700",
    textAlign: "center",
    fontSize: 12,
    color: "white",
    marginTop: 7
  },
  buttonColor1Stake: {
    width: "100%",
    height: 40,
    backgroundColor: "transparent",
    borderRadius: 10,
    overflow: "hidden"
  },
  lineStyle: {
    width: "90%",
    borderWidth: 0.5,
    borderColor:'black',
    marginTop: 40,
  },
  mainBtnTop: {
    width: "88%",
    fontFamily: "palanquin-700",
    marginBottom: 10
  },
  cameraBtn: {
    marginLeft:"25%",
    width: "70%",
    position: "absolute",
    top: "80%",
    fontFamily: "palanquin-700",
  },
  accountBtn: {
    width: "50%",
    height: 62,
    fontFamily: "palanquin-700",
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountBtn2: {
    width: "33%",
    height: 62,
    fontFamily: "palanquin-700",
    justifyContent: 'center',
    alignItems: 'center',
  },
};