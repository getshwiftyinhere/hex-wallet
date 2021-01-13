import * as React from "react";
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert, Button,
    Clipboard,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Linking,
    Picker,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "i18n-js";
import style from '../styles/style';
import styles from '../styles/walletStyle';
import styles2 from '../styles/walletStyle2';
import {ethers} from "ethers";
import {EthereumContext} from "./EthereumProvider";
import * as Assets from "../lib/ethereum/assets";
import AssetContract, {Asset, AssetType} from "../lib/ethereum/assets";
import FeatherIcon from "react-native-vector-icons/Feather";
import QRCode from 'react-native-qrcode-svg';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as LocalAuthentication from 'expo-local-authentication';
import {Table, Row, Rows} from 'react-native-table-component';
import NumberFormat from 'react-number-format';
import Modal from 'react-native-modal';
import {
    changeCurrentAccountName,
    getAccounts,
    getCurrentAccount,
    loadAccountAtIndex,
    loadWallet,
    WalletStorageType
} from "../lib/ethereum/wallet";


export function ReactNativeNumberFormat({value}) {
    return (
        <NumberFormat
            value={value}
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
            renderText={formattedValue => <Text>{formattedValue}</Text>} // <--- Don't forget this!
        />
    );
}


let importedSeed = ['', '', '', '', '', '', '', '', '', '', '', ''];
const decimals = 8;
const precision = 5;
const oneDaySeconds = 24 * 60 * 60;

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
const hexContract = new ethers.Contract(AssetContract.hexContractAddress, AssetContract.hexAbi, ethers.getDefaultProvider());


const CoinpaprikaAPI = require('@coinpaprika/api-nodejs-client');
const client = new CoinpaprikaAPI();

let yuanUsd = 0;
let hexUsd = 0;
let ethUsd = 0;
let hexPerEth = 0;
let hxyUsd = 0;
let hxbUsd = 0;
let hxpUsd = 0;

getPrice();

setInterval(function () {
    getPrice();

}, 1800000);

async function getPrice() {
    let result = await client.getTicker({coinId: 'hex-hex'});
    hexUsd = result.price_usd;
    result = await client.getTicker({coinId: 'eth-ethereum'});
    ethUsd = result.price_usd;
    hexPerEth = ethUsd / hexUsd;
    fetch('https://api.exchangeratesapi.io/latest?base=USD')
        .then((response) => response.json())
        .then((json) => {
            yuanUsd = json.rates.CNY;
            yuanUsd = json.rates.CNY;
        })
        .catch((error) => {
            console.error(error);
        });
}

const endStakeBtn = (wallet: ethers.Wallet, prop: any, id: number, index: number) => (
    <View>
        <TouchableOpacity style={styles2.endStakeBtn} onPress={() => prop.endStake(wallet, id, index)}>
            <ImageBackground style={styles2.buttonColor1Stake} imageStyle={styles2.buttonColor1_imageStyle}
                             source={require("../assets/images/bg.png")}>
                <Text style={styles2.endStakeBtnText}>{i18n.t('endStakeBtn')}</Text>
            </ImageBackground>
        </TouchableOpacity>
    </View>
);
let currentValue = '';

const selectAccountBtn = (prop: any, index: number) => (
    <View>
        <TouchableOpacity style={styles2.endStakeBtn} onPress={() => prop.selectAccount(index)}>
            <ImageBackground style={styles2.buttonColor1Stake} imageStyle={styles2.buttonColor1_imageStyle}
                             source={require("../assets/images/bg.png")}>
                <Text style={styles2.endStakeBtnText}>{i18n.t('selectAccountBtn')}</Text>
            </ImageBackground>
        </TouchableOpacity>
    </View>
);

class Wallet extends React.Component<{
    assets: Asset[];
    wallet: ethers.Wallet;
    generateMnemonic: boolean;
    _showMnemonic: boolean;
    showImport: boolean;
    showConfirmSend: boolean;
    mnemonicPhrase: Array<String>;
    createWallet: () => void
    importWallet: (seed: string[], isReady: boolean, isCancel: boolean) => void
    getMnemonic: () => void
    showMnemonic: () => void
    showConfirmScreen: () => void
    hideConfirmScreen: () => void
    sendAsset: (to: string, amount: number, type: AssetType) => Promise<ethers.providers.TransactionResponse>
    _showAccounts: boolean;
    showAccounts: () => void
    loadNewWallet: (wallet: Wallet) => void
}> {
    state = {
        network: '',
        coin: 'HEX',
        recipient: '',
        value: 0,
        stakeDays: 0,
        icon: "hexagon-slice-6",
        coinid: 1,
        error: false,
        showQR: false,
        showCam: false,
        showStakes: false,
        hasCameraPermission: null,
        dollarText: "0.00",
        invalidRecipient: '',
        refreshing: '',
        compatible: false,
        fingerprints: false,
        biometryType: null,
        authResult: '',
        stakes: [] as String[],
        accounts: [] as String[],
        totalAssetValue: 0,
        ethAssetValue: 0,
        hexAssetValue: 0,
        coinAssetValue: 0,
    };



    public componentDidMount = async () => {
        await this.checkDeviceForHardware();
        await this.checkForFingerprints();
        if (this.props.wallet) {
            const network = await this.props.wallet.provider.getNetwork()
            this.setState({network: network.name})
        }
        await this.refreshBalance(this.props.wallet, this.props.assets);
        //await this.getUserFreezings(this.props.wallet);
    }

    checkDeviceForHardware = async () => {
        let compatible = await LocalAuthentication.hasHardwareAsync();
        this.setState({compatible});
    };

    checkForFingerprints = async () => {
        let fingerprints = await LocalAuthentication.isEnrolledAsync();
        this.setState({fingerprints});
    };

    //asks for fingerprint, otherwise device passcode.
    scanFingerprint = async () => {
        let authResult = await LocalAuthentication.authenticateAsync();
        console.log('Scan authResult:', authResult);
        if (!authResult.success) {
            Alert.alert(
                i18n.t('retryPasscodeTitle'),
                i18n.t('retryPasscodeInfo'),
                [
                    {
                        text: i18n.t('retryBtn'), onPress: () => this.scanFingerprint() //do notification stuff
                    },
                ],
                {cancelable: false}
            );
        } else {
            this.setState({authResult: authResult.success.toString()});
        }
    };
    authorizePass() {
        this.scanFingerprint().then(() => {
        });
    }

    async openCamera() {
        if (this.state.hasCameraPermission == null || this.state.hasCameraPermission == false) {
            await this._requestCameraPermission();
            this.setState({showCam: true});
        } else {
            this.setState({showCam: true});
        }
    }

    _requestCameraPermission = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted',
        });
    };

    _handleBarCodeRead = result => {
        if (result.data !== this.state.recipient) {
            let prefix = "ethereum:"
            let prefix2 = "ETH:"
            if (result.data.includes(prefix)) {
                result.data = result.data.slice(prefix.length, result.data.length);
            } else if (result.data.includes(prefix2)) {
                result.data = result.data.slice(prefix2.length, result.data.length);
            }
            this.handleRecipientInput(result.data);
            this.setState({showCam: false});
        }
    };

    handleImportInput(index: number, inputValue: string) {
        importedSeed[index] = inputValue.toLowerCase();
    }

    handleInput(inputValue: string) {
        if (inputValue == '') {
            inputValue = "0";
        }
        currentValue = inputValue;
        let input = parseFloat(inputValue);
        let hexRate = (hexPerEth * input).toFixed(1);
        let usdEthRate = (ethUsd * input).toFixed(2);
        let usdHexRate = (hexUsd * input).toFixed(2);
        if (this.state.coin == "ETH") {
            this.setState({dollarText: usdEthRate});
        } else if (this.state.coin == "HEX") {
            this.setState({dollarText: usdHexRate});
        }
        this.setState({value: input});
        //this.setState({aaText: "~" + aaRate + " HEX/ETH"});
    }

    handleRecipientInput(inputValue: string) {
        const input = inputValue;
        try {
            ethers.utils.getAddress(input);
            console.log("valid recipient");
            this.setState({recipient: input});
            this.setState({invalidRecipient: ''});
        } catch (e) {
            if (input == '') {
                this.setState({invalidRecipient: ''});
            } else {
                console.log("invalid recipient");
                this.setState({invalidRecipient: i18n.t('invalidAddress')});
            }
            this.setState({recipient: ''});
        }
    }

    selectCoin(_itemValue: string, _itemIndex: number) {
        if (_itemValue == "ETH") {
            this.setState({icon: "ethereum"});
            this.setState({coinAssetValue: this.state.ethAssetValue});
        } else if (_itemValue == "HEX") {
            this.setState({icon: "hexagon-slice-6"});
            this.setState({coinAssetValue: this.state.hexAssetValue});
        }
        this.setState({coin: _itemValue});
        this.setState({coinid: _itemIndex});
        let self = this;
        setTimeout(function () {
            self.handleInput(currentValue);
        }, 500, self);
    }

    selectCoinIOS() {
        if (Platform.OS == 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["ETH", "HEX", i18n.t('cancelBtn')],
                    cancelButtonIndex: 2
                },
                buttonIndex => {
                    if (buttonIndex === 2) {
                        // cancel action
                    } else if (buttonIndex === 0) {
                        this.setState({icon: "ethereum"});
                        this.setState({coin: "ETH"});
                        this.setState({coinid: 0});
                        this.setState({coinAssetValue: this.state.ethAssetValue});
                    } else if (buttonIndex === 1) {
                        this.setState({icon: "hexagon-slice-6"});
                        this.setState({coin: "HEX"});
                        this.setState({coinid: 1});
                        this.setState({coinAssetValue: this.state.hexAssetValue});
                    } 
                    let self = this;
                    setTimeout(function () {
                        self.handleInput(currentValue);
                    }, 500, self);
                }
            );
        }
    }

    showStakes(address: string) {
        let url = "https://hexinfo.io/stakes/" + address;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    showTx(address: string) {
        let url = i18n.t('etherscanAddress') + address;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    clearPhrase() {
        for (let i = 0; i < importedSeed.length; i++) {
            importedSeed[i] = '';
        }
    }

    freezeTimeRemaining(timestamp: number, days: number) {
        let endTime = this.getEndTime(timestamp, days);
        let secondsLeft = endTime - Date.now()/1000;
        let dateString = this.formatTime(secondsLeft);
        if (!dateString) {
            return i18n.t('freezeCompleted');
        } else {
            return dateString;
        }
    }

    freezeTimeElapsed(timestamp: number) {
        if (timestamp == 0) {
            return i18n.t('freezeNotStarted');
        }
        let secondsElapsed = Date.now()/1000 - timestamp;
        return this.formatTime(secondsElapsed);
    }

    async refreshBalance(wallet: ethers.Wallet, assets: [Asset]) {
        this.setState({refreshing: i18n.t('refreshing')});
        assets[0].balance = await Assets.getEtherBalance(wallet);
        assets[1].balance = await Assets.getTokenBalance(AssetContract.hexContractAddress, wallet);

        // Calculate total asset value
        const _ethAssetValue = assets[0].balance * ethUsd;
        const _hexAssetValue = assets[1].balance * hexUsd;

        const _totalAssetValue = _ethAssetValue + _hexAssetValue;
        console.log("Total asset value = $", _totalAssetValue);
        this.setState({ethAssetValue: _ethAssetValue.toFixed(2)});
        this.setState({hexAssetValue: _hexAssetValue.toFixed(2)});

        this.setState({totalAssetValue: _totalAssetValue.toFixed(2)});

        if (this.state.coin == "ETH") {
            this.setState({coinAssetValue: this.state.ethAssetValue});
        } else if (this.state.coin == "HEX") {
            this.setState({coinAssetValue: this.state.hexAssetValue});
        }
        const self = this;
        setTimeout(async function () {
            self.setState({refreshing: ''});
        }, 1500, self);
    }

    stakeHex(wallet: ethers.Wallet) {
        if (this.state.coin == "ETH" || this.state.stakeDays == 0 || this.state.stakeDays > 5555 ||
            this.state.value == 0 || this.state.value > this.props.assets[this.state.coinid].balance) {
            if (this.state.value > this.props.assets[this.state.coinid].balance) {
                Alert.alert(
                    i18n.t('insufficientBalanceTitle'),
                    i18n.t('insufficientBalanceInfo'),
                    [
                        {
                            text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                        },
                    ],
                    {cancelable: true}
                );
            } else {
                Alert.alert(
                    i18n.t('selectHexTitle'),
                    i18n.t('selectHexInfo'),
                    [
                        {
                            text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                        },
                    ],
                    {cancelable: true}
                );
            }
        } else {
            Alert.alert(
                i18n.t('confirmStakeHexTitle'),
                i18n.t('confirmStakeHexInfo'),
                [
                    {
                        text: i18n.t('cancelBtn'), onPress: () => {
                            console.log("stake cancelled");
                        }
                    },
                    {
                        text: i18n.t('confirmBtn'), onPress: () => {
                            this.sendStake(wallet);
                        }
                    },
                ],
                {cancelable: true}
            );
        }
    }

    async sendStake(wallet: ethers.Wallet) {
        try {
            let tx = await Assets.stakeHEX(wallet, this.state.value, this.state.stakeDays);
            let url = i18n.t('etherscanTx') + tx.hash;
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: " + url);
                }
            });
        } catch (e) {
            Alert.alert(
                i18n.t('errorTitle'),
                i18n.t(e),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => {
                            console.log("error dismissed")
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    }

    buyHex(wallet: ethers.Wallet) {
        if (this.state.coin == "HEX" || this.state.value == 0 || this.state.value > this.props.assets[this.state.coinid].balance) {
            Alert.alert(
                i18n.t('selectEthTitle'),
                i18n.t('selectEthInfo'),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                    },
                ],
                {cancelable: true}
            );
            if (this.state.value > this.props.assets[this.state.coinid].balance) {
                Alert.alert(
                    i18n.t('insufficientBalanceTitle'),
                    i18n.t('insufficientBalanceInfo'),
                    [
                        {
                            text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                        },
                    ],
                    {cancelable: true}
                );
            }
        } else {
            Alert.alert(
                i18n.t('confirmBuyHexTitle'),
                i18n.t('confirmBuyHexInfo'),
                [
                    {
                        text: i18n.t('cancelBtn'), onPress: () => {
                            console.log("buy cancelled");
                        }
                    },
                    {
                        text: i18n.t('confirmBtn'), onPress: () => {
                            this.sendBuy(wallet);
                        }
                    },
                ],
                {cancelable: true}
            );
        }
    }

    async sendBuy(wallet: ethers.Wallet) {
        try {
            console.log("sending buy");
            await Assets.buyHex(wallet, this.state.value);
        } catch (e) {
            Alert.alert(
                i18n.t('errorTitle'),
                i18n.t(e),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => {
                            console.log("error dismissed")
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    }

    sellHex(wallet: ethers.Wallet) {
        if (this.state.coin == "ETH" || this.state.value == 0 || this.state.value > this.props.assets[this.state.coinid].balance) {
            Alert.alert(
                i18n.t('selectHexTitle'),
                i18n.t('selectHexSellInfo'),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                    },
                ],
                {cancelable: true}
            );
            if (this.state.value > this.props.assets[this.state.coinid].balance) {
                Alert.alert(
                    i18n.t('insufficientBalanceTitle'),
                    i18n.t('insufficientBalanceInfo'),
                    [
                        {
                            text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                        },
                    ],
                    {cancelable: true}
                );
            } 
            
        } else {
            Alert.alert(
                i18n.t('confirmSellHexTitle'),
                i18n.t('confirmSellHexInfo'),
                [
                    {
                        text: i18n.t('cancelBtn'), onPress: () => {
                            console.log("sell cancelled");
                        }
                    },
                    {
                        text: i18n.t('confirmBtn'), onPress: () => {
                            this.sendSell(wallet);
                        }
                    },
                ],
                {cancelable: true}
            );
        }
    }

    async sendSell(wallet: ethers.Wallet) {
        try {
            console.log("sending sell");
            await Assets.sellHex(wallet, this.state.value);
        } catch (e) {
            Alert.alert(
                i18n.t('errorTitle'),
                i18n.t(e),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => {
                            console.log("error dismissed")
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    }

    handleDaysInput(inputValue: number) {
        const input = inputValue;
        if (input > 5555) {
            Alert.alert(
                i18n.t('invalidSelection'),
                i18n.t('stakeInfo'),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed') //do notification stuff
                    },
                ],
                {cancelable: false}
            );
        } else {
            this.setState({stakeDays: input});
        }
    }

    async populateAccounts() {
        let accountList = await getAccounts();
        this.setState({accounts: [] as String[]});
        for (let i = 0; i < accountList.accounts.length; i++) {
            const account = accountList.accounts[i];
            let accounts = this.state.accounts;
            if (i === accountList.current) {
                accounts[i] = new Array<String>(account.name, account.address.toLowerCase(), i18n.t('current'));
            } else {
                accounts[i] = new Array<String>(account.name, account.address.toLowerCase(), selectAccountBtn(this, i));
            }
            this.setState({accounts: accounts});
        }
        return true;
    }

    async populateStakingList(wallet: ethers.Wallet) {
        let currentDay = await hexContract.currentDay();
        let stakeCount = await hexContract.stakeCount(wallet.address);
        this.setState({stakes: [] as String[]});
        for (let i = 0; i < stakeCount; i++) {
            let stake = await hexContract.stakeLists(wallet.address, i);
            let stakeId = stake.stakeId;
            let stakeIndex = 0;
            stakeIndex = await getStakeIndex(wallet.address, stakeId, stakeCount) as number;
            let stakedHex = parseInt(stake.stakedHearts._hex) / (10 ** decimals);
            let stakeLength = stake.stakedDays;
            let stakeStart = stake.lockedDay;
            let daysSinceStake;
            let daysSince = (currentDay - stakeStart).toString();
            if (parseInt(daysSince) < 0) {
                daysSinceStake = i18n.t('pending');
            } else if (parseInt(daysSince) == 0) {
                daysSinceStake = i18n.t('today');
            } else {
                daysSinceStake = daysSince + i18n.t('daysSince');
            }
            let daysTillEnd;
            let daysLeft = ((stakeStart - currentDay) + stakeLength).toString();
            if (parseInt(daysLeft) <= 0) {
                daysTillEnd = i18n.t('finished');
            } else if (parseInt(daysLeft) <= -14) {
                daysTillEnd = i18n.t('late');
            } else {
                daysTillEnd = daysLeft + i18n.t('daysLeft');
            }

            let stakes = this.state.stakes;
            let newRow = new Array<String>(stakedHex.toString(), stakeLength, daysSinceStake, daysTillEnd, endStakeBtn(wallet, this, stakeId, stakeIndex));
            stakes[i] = newRow;
            this.setState({stakes: stakes});
        }
        return true;
    }

    async endStake(wallet: ethers.Wallet, index: number, id: number) {
        try {
            Alert.alert(
                i18n.t('endStakeWarnTitle'),
                i18n.t('endStakeWarnInfo'),
                [
                    {text: i18n.t('cancelBtn')},
                    {
                        text: i18n.t('okBtn'), onPress: () => Assets.endStake(wallet, index, id).then(function (tx) {
                            let url = i18n.t('etherscanTx') + tx.hash;
                            Linking.canOpenURL(url).then(supported => {
                                if (supported) {
                                    Linking.openURL(url);
                                } else {
                                    console.log("Don't know how to open URI: " + url);
                                }
                            });
                        })
                    },
                ],
                {cancelable: true}
            );
        } catch (e) {
            Alert.alert(
                i18n.t('errorTitle'),
                i18n.t(e),
                [
                    {
                        text: i18n.t('okBtn'), onPress: () => {
                            console.log("error dismissed")
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    }

    async selectAccount(index: number) {
        console.log("Selected account at index ", index)
        await loadAccountAtIndex(index)
        const newWallet = await loadWallet(WalletStorageType.privateKey)
        this.props.showAccounts()
        this.props.loadNewWallet(newWallet)
        this.state.totalAssetValue = 0      // Prepare to refresh account
    }

    async changeAccountName(name: string) {
        await changeCurrentAccountName(name)
    }

    formatTime(diff: number) {
        const periods = {
            day: 24 * 60 * 60,
            hour: 60 * 60,
            minute: 60
        };

        if (diff > periods.day) {
            return Math.floor(diff / periods.day) + "d" +
                Math.floor(diff % periods.day / periods.hour) + "h" +
                Math.floor(diff % periods.hour / periods.minute) + "m";
        } else if (diff > periods.hour) {
            return Math.floor(diff / periods.hour) + "h" +
                Math.floor(diff % periods.hour / periods.minute) + "m";
        } else if (diff > periods.minute) {
            return Math.floor(diff / periods.minute) + "m";
        }
        return null;
    }

    getDaysLeft(wallet: ethers.Wallet, timestamp: number, days: number) {
        let endTime = this.getEndTime(timestamp, days);
        let secondsLeft = endTime - Date.now()/1000;
        let dateString = this.formatTime(secondsLeft);
        if (!dateString) {
            return unfreezeBtn(wallet, this, timestamp, days);
        } else {
            return dateString;
        }
    }

    getEndTime(timestamp: number, days: number){
        return timestamp + (days * oneDaySeconds);
    }

    doSort(ascending: boolean){
        ascending = typeof ascending == 'undefined' || ascending == true;
        return function (a, b) {
            let ret = a[1] - b[1];
            return ascending ? ret : -ret;
        };
    }

    public render() {
        const {network} = this.state
        const {assets, wallet, createWallet, importWallet, sendAsset, getMnemonic, showMnemonic, showAccounts, loadNewWallet} = this.props;

        if (this.props.generateMnemonic) {
            return (
                <ScrollView style={styles2.container}>
                    <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                    </Image>
                    <Text style={style.pageTitle}>
                        {i18n.t('mnemonicSubTitle')}
                    </Text>
                    <Image
                        source={require("../assets/images/hex-logo.png")}
                        resizeMode="contain"
                        style={style.hexLogo}
                    />
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletCreationProc}>
                            {i18n.t('mnemonicTitle')}
                        </Text>
                        <Text style={styles2.prepareToRecordTh}>
                            {i18n.t('mnemonicInfo')}
                        </Text>
                        <View style={styles2.phraseCont}>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[0]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>1</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[1]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>2</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[2]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>3</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[3]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>4</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[4]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>5</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[5]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>6</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[6]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>7</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[7]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>8</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[8]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>9</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[9]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>10</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[10]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>11</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[11]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>12</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles2.mainBtn} onPress={(createWallet)}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('savedMnemonicBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else if (this.props._showMnemonic) {
            return (
                <ScrollView style={styles2.container}>
                    <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                    </Image>
                    <Text style={style.pageTitle}>
                        {i18n.t('mnemonicSubTitle')}
                    </Text>
                    <Image
                        source={require("../assets/images/hex-logo.png")}
                        resizeMode="contain"
                        style={style.hexLogo}
                    />
                    <Text style={styles.privateKey}>
                        <Text style={styles2.address} numberOfLines={1}>
                            {i18n.t('privateKeyTitle')}
                        </Text>
                    </Text>

                    <View style={styles.row}>
                        <View style={styles.privateKeyBtn}>
                            <TouchableOpacity onPress={() => {
                                writePrivateKeyToClipboard(getCurrentAccount().privateKey)
                            }}>
                                <Text style={styles2.address} ellipsizeMode={'middle'} numberOfLines={1}>
                                    {getCurrentAccount().privateKey}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles2.privateKeyView}>
                            <MaterialCommunityIconsIcon name="content-copy" style={styles.lightEyeIcon}
                                                        onPress={() => {
                                                            writePrivateKeyToClipboard(getCurrentAccount().privateKey)
                                                        }}/>
                        </Text>
                    </View>
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletCreationProc}>
                            {i18n.t('mnemonicTitle')}
                        </Text>
                        <Text style={styles2.prepareToRecordTh}>
                            {i18n.t('mnemonicInfo')}
                        </Text>
                        <View style={styles2.phraseCont}>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[0]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>1</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[1]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>2</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[2]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>3</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[3]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>4</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[4]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>5</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[5]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>6</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[6]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>7</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[7]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>8</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[8]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>9</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[9]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>10</Text>
                                </View>
                            </View>
                            <View style={styles2.phraseRow}>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[10]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>11</Text>
                                </View>
                                <View style={styles2.phraseBox}>
                                    <Text style={styles2.phraseText}>
                                        {this.props.mnemonicPhrase[11]}
                                    </Text>
                                    <Text style={styles2.phraseNum}>12</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles2.mainBtn} onPress={showMnemonic}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('okBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else if (this.state.showQR) {
            return (
                <ScrollView style={styles2.container}>
                    <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                    </Image>
                    <Text style={styles2.walletSetUp}>{i18n.t('walletQrSubtitle')}</Text>
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletQrTitle}>
                            {i18n.t('walletQrTitle')}
                        </Text>
                        <QRCode
                            value={wallet.address}
                            size={250}
                        />
                        <View style={styles.icon2Stack}>
                            <FeatherIcon name="copy" style={styles.icon2} onPress={() => {
                                writeToClipboard(wallet)
                            }}/>
                            <Text style={styles.copy}>{i18n.t('walletAddressTitle')}</Text>
                        </View>
                        <Text style={styles.walletAddress}>{wallet.address}</Text>
                        <TouchableOpacity style={styles2.mainBtn} onPress={() => this.setState({showQR: false})}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('okBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else if (this.state.showCam) {
            return (
                <BarCodeScanner
                    onBarCodeScanned={this._handleBarCodeRead}
                    style={{
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width,
                    }}
                >
                    <Text style={styles2.cameraQrTitle}>
                        {i18n.t('walletQrTitle')}
                    </Text>
                    <TouchableOpacity style={styles2.cameraBtn} onPress={() => this.setState({showCam: false})}>
                        <ImageBackground style={styles2.buttonColor1} imageStyle={styles2.buttonColor1_imageStyle}
                                             source={require("../assets/images/button_bg.png")}>
                            <Text style={styles2.homeScreen}> {i18n.t('cancelBtn')}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </BarCodeScanner>
            );
        } else if (this.props.showConfirmSend) {
            return (
                <ScrollView style={styles2.container}>
                    <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                    </Image>
                    <Text style={styles2.walletSetUp}>{i18n.t('confirmSendSubtitle')}</Text>
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletQrTitle}>
                            {i18n.t('confirmSendTitle')}
                        </Text>
                        <Text style={styles.sendInfo}>{i18n.t('confirmSendInfo')}</Text>
                        <View>
                            <Text
                                style={styles.walletAddress}>{i18n.t('sending')} {this.state.value} {this.state.coin}</Text>
                            <Text style={styles.walletAddress}>{i18n.t('from')}{wallet.address} </Text>
                            <Text style={styles.walletAddress}>{i18n.t('to')}{this.state.recipient} </Text>
                        </View>
                        <TouchableOpacity style={styles2.mainBtnTop} onPress={() => {
                            this.props.hideConfirmScreen()
                        }}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('cancelBtn')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles2.mainBtn}
                                          onPress={() => sendAsset(this.state.recipient, this.state.value, this.state.coin as AssetType)}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('confirmBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else if (this.state.showStakes) {
            return (
                <ScrollView style={styles2.container}>
                    <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                    </Image>
                    {/*}
                    <Text style={styles2.walletSetUp}>{i18n.t('stakesSubtitle')}</Text>
                    {*/}
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletCreationProc}>
                            {i18n.t('stakesTitle')}
                        </Text>
                        <Image
                            onLoad={() => this.populateStakingList(wallet)}
                            source={require("../assets/images/onboarding4.png")}
                            resizeMode="contain"
                            style={styles2.art}
                        />
                        <Text style={styles2.prepareToRecordTh}>
                            {i18n.t('stakesInfo')}
                        </Text>
                        <Table style={styles.table} borderStyle={{borderWidth: 1}}>
                            <Row data={this.state.stakeHead} style={styles.sectionHeader}
                                 textStyle={styles.headerText}/>
                            <Rows data={this.state.stakes} style={styles.tableRow} textStyle={styles.tableText}/>
                        </Table>
                        <TouchableOpacity style={styles2.mainBtn} onPress={() => this.setState({showStakes: false})}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('backBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else if (this.props.showImport) {
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                    style={{flex: 1}}>
                    <ScrollView style={styles2.container}>
                        <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                        </Image>
                        <Text style={style.pageTitle}>
                            {i18n.t('importSubtitle')}
                        </Text>
                        <Image
                          source={require("../assets/images/hex-logo.png")}
                          resizeMode="contain"
                          style={style.hexLogo}
                        />
                        <View style={styles2.centerBox}>
                            <Text style={styles2.walletCreationProc}>
                                {i18n.t('importTitle')}
                            </Text>
                            <Text style={styles2.prepareToRecordTh}>
                                {i18n.t('importInfo')}
                            </Text>
                            <View style={styles2.phraseCont}>
                                <View style={styles2.phraseRow}>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   autoFocus={true}
                                                   ref={ref => {
                                                       this._input1 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input2.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(0, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>1</Text>
                                    </View>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input2 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input3.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(1, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>2</Text>
                                    </View>
                                </View>
                                <View style={styles2.phraseRow}>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input3 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input4.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(2, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>3</Text>
                                    </View>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input4 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input5.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(3, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>4</Text>
                                    </View>
                                </View>
                                <View style={styles2.phraseRow}>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input5 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input6.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(4, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>5</Text>
                                    </View>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input6 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input7.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(5, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>6</Text>
                                    </View>
                                </View>
                                <View style={styles2.phraseRow}>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input7 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input8.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(6, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>7</Text>
                                    </View>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input8 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input9.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(7, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>8</Text>
                                    </View>
                                </View>
                                <View style={styles2.phraseRow}>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input9 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input10.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(8, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>9</Text>
                                    </View>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input10 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input11.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(9, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>10</Text>
                                    </View>
                                </View>
                                <View style={styles2.phraseRow}>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"next"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input11 = ref
                                                   }}
                                                   onSubmitEditing={() => {
                                                       this._input12.focus()
                                                   }}
                                                   onChange={(input) => this.handleImportInput(10, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>11</Text>
                                    </View>
                                    <View style={styles2.phraseBox}>
                                        <TextInput style={styles2.phraseTextInput}
                                                   keyboardType={"default"}
                                                   returnKeyType={"done"}
                                                   autoCapitalize={"none"}
                                                   autoCorrect={false}
                                                   ref={ref => {
                                                       this._input12 = ref
                                                   }}
                                                   onChange={(input) => this.handleImportInput(11, input.nativeEvent.text)}>
                                        </TextInput>
                                        <Text style={styles2.phraseNum}>12</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.accountRow}>
                                <TouchableOpacity style={styles2.accountBtn}
                                                  onPress={() => importWallet(importedSeed, true, false)}>
                                    <ImageBackground style={styles2.buttonColor1}
                                                     imageStyle={styles2.buttonColor1_imageStyle}
                                                     source={require("../assets/images/button_bg.png")}>
                                        <Text style={styles2.homeScreen}> {i18n.t('okBtn')}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles2.accountBtn}
                                                  onPress={() => importWallet(importedSeed, false, true)}>
                                    <ImageBackground style={styles2.buttonColor1}
                                                     imageStyle={styles2.buttonColor1_imageStyle}
                                                     source={require("../assets/images/button_bg.png")}>
                                        <Text style={styles2.homeScreen}> {i18n.t('cancelBtn')}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            );
        } else if (this.props._showAccounts) {
            return (
                <Modal
                    animationType={"slide"}
                    visible={this.props._showAccounts}
                >
                    <ScrollView style={styles2.container}>
                        <View style={styles.modalContent}>
                            <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                            </Image>
                            <Text style={style.pageTitle}>
                                {i18n.t('selectAccountSubtitle')}
                            </Text>
                            <Image
                                source={require("../assets/images/hex-logo.png")}
                                resizeMode="contain"
                                style={style.hexLogo}
                            />
                            <View style={styles2.centerBox} onLayout={() => this.populateAccounts()}>
                                <Table
                                    style={styles.accountsTable}
                                    borderStyle={{borderWidth: 1}
                                    }>
                                    <Rows data={this.state.accounts}
                                          style={styles.accountsTableRow}
                                          textStyle={styles.accountsTableText}
                                          flexArr={[.5, 1, .3]}
                                    />
                                </Table>
                            </View>
                            <View style={styles.accountRow}>
                                <TouchableOpacity style={styles2.accountBtn2} onPress={(getMnemonic)}>
                                    <ImageBackground style={styles2.buttonColor1} imageStyle={styles2.buttonColor1_imageStyle}
                                                     source={require("../assets/images/button_bg.png")}>
                                        <Text style={styles2.homeScreen}> {i18n.t('createWalletBtn')}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles2.accountBtn2}
                                                  onPress={() => importWallet(importedSeed, false, false)}>
                                    <ImageBackground style={styles2.buttonColor1} imageStyle={styles2.buttonColor1_imageStyle}
                                                     source={require("../assets/images/button_bg.png")}>
                                        <Text style={styles2.homeScreen}> {i18n.t('importWalletBtn')}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles2.accountBtn2} onPress={showAccounts}>
                                    <ImageBackground style={styles2.buttonColor1} imageStyle={styles2.buttonColor1_imageStyle}
                                                     source={require("../assets/images/button_bg.png")}>
                                        <Text style={styles2.homeScreen}> {i18n.t('cancelBtn')}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            );
        } else if (this.state.error) {
            return (
                <ScrollView style={styles2.container}>
                    <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                    </Image>
                    <Text style={styles2.walletSetUp}>{i18n.t('errorSubtitle')}</Text>
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletCreationProc}>
                            {i18n.t('errorTitle')}
                        </Text>
                        <MaterialCommunityIconsIcon
                            name="error"
                            //style={styles.errorIcon}
                        />
                        <Text style={styles2.prepareToRecordTh}>
                            {i18n.t('errorInfo')}
                        </Text>
                        <TouchableOpacity style={styles2.mainBtn} onPress={() => this.setState({error: false})}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('backBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else if (wallet && !this.state.authResult) {
            return (
                <ScrollView style={styles2.container}>
                    <Image onLoad={() => this.authorizePass()} style={styles2.background}
                           source={require("../assets/images/bg.png")}>
                    </Image>
                    {/*}
                    <Text style={styles2.walletSetUp}>{i18n.t('authorizeTitle')}</Text>
                    {*/}
                    <View style={styles2.centerBox}>
                        <Text style={styles2.walletCreationProc}>
                            {i18n.t('authorizeTitle')}
                        </Text>
                        <Image
                            source={require("../assets/images/onboarding4.png")}
                            resizeMode="contain"
                            style={styles2.art}
                        />
                        <Text style={styles2.prepareToRecordTh}>
                            {i18n.t('authorizeInfo')}
                        </Text>
                        <TouchableOpacity style={styles2.mainBtn}>
 
                                <Text style={styles2.homeScreen}> {i18n.t('cancelBtn')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        } else {
            if (wallet && this.state.authResult) {
                return (
                    <ScrollView style={styles2.container}>
                        <Image onLoad={() => this.refreshBalance(this.props.wallet, assets)} style={styles2.background}
                               source={require("../assets/images/bg.png")}>
                        </Image>
                        <Text style={style.pageTitle}>
                            {i18n.t('walletSubtitle')}
                        </Text>
                        <Image
                            source={require("../assets/images/hex-logo.png")}
                            resizeMode="contain"
                            style={style.hexLogo}
                        />
                        {/* Account info view start */}
                        <View style={styles.accountBtn}>
                            <TouchableOpacity
                                onPress={showAccounts}>
                                <Text style={styles2.account} numberOfLines={1}>
                                    {getCurrentAccount().name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.assetValue}>
                            <Text style={styles2.address} numberOfLines={1}> ${
                                <ReactNativeNumberFormat
                                    value={this.state.totalAssetValue} />
                                }
                            </Text>
                        </Text>
                        <View style={styles.row}>
                            <View style={styles.addressBtn}>
                                <TouchableOpacity onPress={() => {
                                    writeToClipboard(wallet)
                                }}>
                                    <Text style={styles2.address} ellipsizeMode={'middle'} numberOfLines={1}>
                                        {getCurrentAccount().address}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles2.transactionView}>
                                <MaterialCommunityIconsIcon name="eye" style={styles.lightEyeIcon}
                                                            onPress={() => this.showTx(wallet.address)}/>
                            </Text>
                            <Text style={styles2.mnemonicView}>
                                <MaterialCommunityIconsIcon name="book-lock" style={styles.lightEyeIcon}
                                                            onPress={showMnemonic}/>
                            </Text>
                        </View>
                        {/* Account info view end */}

                        <View style={styles2.walletCenterBox}>
                            <View style={styles2.pickerCont}>
                                <View style={styles.row}>
                                    <Text style={styles2.balanceUpdate}>
                                        {this.state.refreshing}
                                    </Text>
                                    <Text style={styles2.balance}>
                                        <MaterialCommunityIconsIcon name={this.state.icon}
                                                                    style={styles.balanceIcon}/>
                                        {
                                            assets[this.state.coinid].type} {i18n.t('balanceText')} {
                                            <ReactNativeNumberFormat
                                                value={assets[this.state.coinid].balance.toFixed(precision)}/>
                                        }
                                    </Text>
                                    <MaterialCommunityIconsIcon onPress={() => this.refreshBalance(wallet, assets)}
                                                                name="refresh"
                                                                style={styles.refreshIcon}/>
                                     <Text style={styles2.balanceUsd}>
                                         $ <ReactNativeNumberFormat value={this.state.coinAssetValue}/>
                                     </Text>
                                </View>
                            </View>

                            <View style={styles.formCont}>
                                <View style={styles.inputRow}>
                                    <MaterialCommunityIconsIcon
                                        name="account-box"
                                        style={styles.recipientIcon}
                                    />
                                    <TextInput
                                        placeholder={i18n.t('recipient')}
                                        style={styles.recipientInput}
                                        placeholderTextColor={"lightgrey"}
                                        keyboardType={"default"}
                                        onEndEditing={(input) => this.handleRecipientInput(input.nativeEvent.text)}
                                    >{this.state.recipient}</TextInput>
                                    <MaterialCommunityIconsIcon
                                        name="camera"
                                        style={styles.camIcon}
                                        onPress={() => this.openCamera()}
                                    />
                                </View>
                                <Text style={styles.invalidRecipient}>{this.state.invalidRecipient}</Text>
                                <View style={styles.inputRow}>
                                    <Picker
                                        selectedValue={this.state.coin}
                                        style={styles2.picker}
                                        itemStyle={styles2.pickerArrow}
                                        onValueChange={(itemValue, itemIndex) => this.selectCoin(itemValue, itemIndex)}>
                                        {assets.map(asset => (
                                            <Picker.Item key={asset.type} label={asset.type} value={asset.type}/>
                                        ))}
                                    </Picker>
                                    <MaterialCommunityIconsIcon
                                        onPress={() => this.selectCoinIOS()}
                                        name={this.state.icon}
                                        style={styles.ethIcon}
                                    />
                                    <TextInput
                                        placeholder={i18n.t('amount')}
                                        style={styles.valueInput}
                                        placeholderTextColor={"lightgrey"}
                                        keyboardType={"decimal-pad"}
                                        onChange={(input) => this.handleInput(input.nativeEvent.text)}
                                    />
                                </View>
                                <View style={styles.iconStackRow}>
                                    <MaterialCommunityIconsIcon
                                        name="currency-usd"
                                        style={styles.dollarIcon}
                                    />
                                    <Text style={styles.dollarText}>{this.state.dollarText}</Text>
                                </View>
                            </View>
                            <View style={styles.btnCont}>
                                <View style={styles.mainBtn}>
                                    <TouchableOpacity style={styles.rect} onPress={() => {
                                        if (this.state.recipient == "" || this.state.value > this.props.assets[this.state.coinid].balance) {
                                            if (this.state.value > this.props.assets[this.state.coinid].balance) {
                                                Alert.alert(
                                                    i18n.t('insufficientBalanceTitle'),
                                                    i18n.t('insufficientBalanceInfo'),
                                                    [
                                                        {
                                                            text: i18n.t('okBtn'),
                                                            onPress: () => console.log('OK Pressed') //do notification stuff
                                                        },
                                                    ],
                                                    {cancelable: true}
                                                );
                                            } else if (this.state.recipient == "") {
                                                Alert.alert(
                                                    i18n.t('noRecipient'),
                                                    i18n.t('noRecipientInfo'),
                                                    [
                                                        {
                                                            text: i18n.t('okBtn'),
                                                            onPress: () => console.log('OK Pressed') //do notification stuff
                                                        },
                                                    ],
                                                    {cancelable: true}
                                                );
                                            }

                                        } else {
                                            this.props.showConfirmScreen();
                                        }
                                    }}>
                                        <ImageBackground
                                            style={styles.buttonColor1}
                                            //imageStyle={styles.buttonColor1_imageStyle}
                                            //source={require("../assets/images/button_bg.png")}
                                            >
                                            <Text style={styles.homeScreen}>
                                                {i18n.t('sendBtn') + "  "}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.mainBtn}>
                                    <TouchableOpacity style={styles.rect}
                                                      onPress={() => this.setState({showQR: true})}>
                                        <ImageBackground
                                            style={styles.buttonColor1}
                                            //imageStyle={styles.buttonColor1_imageStyle}
                                            //source={require("../assets/images/button_bg.png")}
                                            >
                                            <Text style={styles.homeScreen}>
                                                {i18n.t('receiveBtn') + "  "}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style = {styles2.lineStyle} />

                            {/* HEX Functions */}
                            <View style={styles2.titleView}>
                                <Image style={styles2.titleImage} source={require("../assets/images/hex-logo-silver.png")}>
                                </Image>
                                <Text style={styles2.functionTitle}>
                                    {i18n.t('functionTitle')}
                                </Text>
                            </View>
                            <Text style={styles2.prepareToRecordTh}>
                                {i18n.t('functionInfo')}
                            </Text>
                             <View style={styles.row}>
                                <Text style={styles2.stakeView}>
                                    {i18n.t('stakes')}
                                    <MaterialCommunityIconsIcon name="eye" style={styles.eyeIcon}
                                                                onPress={() => this.setState({showStakes: true})}/>
                                </Text>
                            </View>
                            <View style={styles.btnCont}>
                                <View style={styles.stakeBtn}>
                                    <TouchableOpacity style={styles.rect}
                                                      onPress={() => this.stakeHex(this.props.wallet)}>
                                        <ImageBackground
                                            style={styles.buttonColor1}
                                            //imageStyle={styles.buttonColor1_imageStyle}
                                            //source={require("../assets/images/button_bg.png")}
                                            >
                                            <Text style={styles.homeScreen}>
                                                {i18n.t('stakeBtn') + "  "}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputRowSm}>
                                    <MaterialCommunityIconsIcon
                                        name="calendar"
                                        style={styles.calanderIcon}
                                    />
                                    <TextInput
                                        placeholder={i18n.t('stakeDays')}
                                        style={styles.stakeDayInput}
                                        placeholderTextColor={"lightgrey"}
                                        keyboardType={"decimal-pad"}
                                        onChange={(input) => this.handleDaysInput(input.nativeEvent.text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.btnCont}>
                                <View style={styles.stakeBtn}>
                                    <TouchableOpacity style={styles.rect}
                                                      onPress={() => this.buyHex(this.props.wallet)}>
                                        <ImageBackground
                                            style={styles.buttonColor1}
                                            //imageStyle={styles.buttonColor1_imageStyle}
                                            //source={require("../assets/images/button_bg.png")}
                                            >
                                            <Text style={styles.homeScreen}>
                                                {i18n.t('buyBtn') + "  "}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.stakeBtn}>
                                    <TouchableOpacity style={styles.rect}
                                                      onPress={() => this.sellHex(this.props.wallet)}>
                                        <ImageBackground
                                            style={styles.buttonColor1}
                                            //imageStyle={styles.buttonColor1_imageStyle}
                                            //source={require("../assets/images/button_bg.png")}
                                            >
                                            <Text style={styles.homeScreen}>
                                                {i18n.t('sellBtn') + "  "}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style = {styles2.lineStyle} />

                        </View>
                    </ScrollView>
                );
            } else if (!wallet && !this.state.authResult) {
                return (
                    <ScrollView style={styles2.container}>
                        <Image style={styles2.background} source={require("../assets/images/bg.png")}>
                        </Image>

                        <Text style={style.pageTitle}>
                            {i18n.t('createWalletSubTitle')}
                        </Text>
                        <Image
                          source={require("../assets/images/hex-logo.png")}
                          resizeMode="contain"
                          style={style.hexLogo}
                        />

                        <View style={styles2.centerBox}>
                            <Text style={styles2.walletCreationProc}>
                                {i18n.t('createWalletTitle')}
                            </Text>
                            <Image
                                source={require("../assets/images/onboarding4.png")}
                                resizeMode="contain"
                                style={styles2.art}
                            />
                            <Text style={styles2.prepareToRecordTh}>
                                {i18n.t('createWalletInfo')}
                            </Text>
                            <TouchableOpacity style={styles2.createBtn} onPress={(getMnemonic)}>
                                <ImageBackground style={btnStyles.buttonColor1}
                                                 imageStyle={btnStyles.buttonColor1_imageStyle}
                                                 source={require("../assets/images/button_bg.png")}>
                                    <Text style={styles2.homeScreen}> {i18n.t('createWalletBtn')}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles2.mainBtn}
                                              onPress={() => importWallet(importedSeed, false, false)}>
                                <ImageBackground style={btnStyles.buttonColor1}
                                                 imageStyle={btnStyles.buttonColor1_imageStyle}
                                                 source={require("../assets/images/button_bg.png")}
                                                 >
                                    <Text style={styles2.homeScreen}> {i18n.t('importWalletBtn')}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                );
            }
        }
    }
}


async function writeToClipboard(wallet: ethers.Wallet) {
    await Clipboard.setString(wallet.address);
    Alert.alert(
        i18n.t('addressCopyConfirmation'),
        i18n.t('addressCopyInfo'),
        [
            {text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false}
    )
}

async function writePrivateKeyToClipboard(key: string) {
    await Clipboard.setString(key);
    Alert.alert(
        i18n.t('privateKeyCopyConfirmation'),
        i18n.t('privateKeyCopyInfo'),
        [
            {text: i18n.t('okBtn'), onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false}
    )
}

const WalletWithData = () => (
    <EthereumContext.Consumer>
        {({assets, wallet, createWallet, importWallet, sendAsset, showImport, generateMnemonic, _showMnemonic, getMnemonic, showMnemonic, mnemonicPhrase, loading, showConfirmSend, showConfirmScreen, hideConfirmScreen, _showAccounts, showAccounts, loadNewWallet}) =>
            loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator color="black" size="large"/>
                </View>
            ) : (
                <Wallet assets={assets} wallet={wallet} createWallet={createWallet} importWallet={importWallet}
                        showImport={showImport} sendAsset={sendAsset} generateMnemonic={generateMnemonic}
                        _showMnemonic={_showMnemonic} showMnemonic={showMnemonic} getMnemonic={getMnemonic}
                        mnemonicPhrase={mnemonicPhrase} showConfirmSend={showConfirmSend}
                        showConfirmScreen={showConfirmScreen} hideConfirmScreen={hideConfirmScreen}
                        _showAccounts={_showAccounts} showAccounts={showAccounts} loadNewWallet={loadNewWallet}/>
            )
        }
    </EthereumContext.Consumer>
);

const getStakeIndex = async (addr: string, sid: number, stakeCount: number) => {
    for (let i = 0; i < stakeCount; i++) {
        let stake = await hexContract.stakeLists(addr, i);
        if (stake.stakeId == sid) {
            return i as Number;
        }
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
  
export default WalletWithData;

