import React from "react";
import {ethers, Wallet} from "ethers";
import {
    createWallet,
    loadWallet,
    sendAsset,
    WalletStorageType,
    getMnemonic,
    importWallet
} from "../lib/ethereum/wallet";
import {loadAssets, AssetType, Asset} from "../lib/ethereum/assets";
import {Alert, Linking} from "react-native";
import i18n from 'i18n-js';

const ASSETS = [AssetType.eth, AssetType.hex];

export interface Ethereum {
    wallet: Wallet;
    assets: Asset[];
    sendAsset: (to: string, amount: number, type: AssetType) => Promise<ethers.providers.TransactionResponse>;
    createWallet: () => void;
    importWallet: (seed: string[], isReady: boolean, isCancel: boolean) => void;
    getMnemonic: () => void;
    showMnemonic: () => void;
    showConfirmScreen: () => void;
    hideConfirmScreen: () => void;
    loading: boolean;
    generateMnemonic: boolean;
    showConfirmSend: boolean;
    _showMnemonic: boolean;
    showImport: boolean;
    mnemonicPhrase: [];
    _showAccounts: boolean;
    showAccounts: () => void;
    loadNewWallet: (wallet: Wallet) => void;
}

export const EthereumContext = React.createContext({} as Ethereum);

interface EthereumProviderProps {
    children: JSX.Element;
}

class EthereumProvider extends React.Component<EthereumProviderProps> {
    state = {
        loading: true,
        generateMnemonic: false,
        _showMnemonic: false,
        showConfirmSend: false,
        mnemonicPhrase: [],
        showImport: false,
        _showAccounts: false
    } as Ethereum;

    public componentDidMount = async () => {
        try {
            const wallet = await loadWallet(WalletStorageType.mnemonics);
            const assets = await loadAssets(ASSETS, wallet);
            this.setState({
                wallet: wallet,
                assets: assets,
                loading: false,
                generateMnemonic: false,
                _showMnemonic: false,
                showImport: false,
                _showAccounts: false
            });
        } catch (e) {
            console.log("ERROR", e);
            this.setState({loading: false});
            this.setState({generateMnemonic: false});
            this.setState({_showMnemonic: false});
        }
    };

    public showConfirmScreen = async () => {
        this.setState({showConfirmSend: true});
    }

    public hideConfirmScreen = async () => {
        this.setState({showConfirmSend: false});
    }

    public sendAsset = async (to: string, amount: number, type: AssetType) => {
        Alert.alert(
            i18n.t('sendAssetConfirm'),
            i18n.t('sendAssetInfo'),
            [
                {
                    text: i18n.t('confirmBtn'), onPress: async () => {
                        const transaction = await sendAsset({
                            wallet: this.state.wallet,
                            to,
                            amount,
                            type,
                        });
                        console.log("transaction", transaction);
                        this.hideConfirmScreen();
                        var url = i18n.t('etherscanTx') + transaction.hash;
                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                Linking.openURL(url);
                            } else {
                                console.log("Don't know how to open URI: " + url);
                            }
                        });
                    }
                },
            ],
            {cancelable: true}
        )

    }

    public createWallet = async () => {
        Alert.alert(
            i18n.t('mnemonicPopUpTitle'),
            i18n.t('mnemonicPopUpInfo'),
            [
                {
                    text: i18n.t('cancelBtn'), onPress: async () => console.log("cancelled")
                },
                {
                    text: i18n.t('okBtn'), onPress: async () => {
                        this.setState({loading: true});
                        const wallet = await createWallet();
                        const assets = await loadAssets(ASSETS, wallet);
                        this.setState({generateMnemonic: false});
                        this.setState({mnemonicPhrase: null});
                        this.setState({wallet, assets, loading: false});
                    }
                },
            ],
            {cancelable: false}
        )
    };

    public importWallet = async (seed: string[], isReady: boolean, isCancel: boolean) => {
        if (isCancel) {
            this.setState({showImport: false});
        } else {
            if (isReady) {
                this.setState({loading: true});
                try {
                    const wallet = await importWallet(seed);
                    const assets = await loadAssets(ASSETS, wallet);
                    this.setState({showImport: false});
                    this.setState({mnemonicPhrase: null});
                    this.setState({wallet, assets, loading: false});
                } catch (e) {
                    this.setState({loading: false});
                    Alert.alert(
                        i18n.t('invalidMnemonicTitle'),
                        i18n.t('invalidMnemonicInfo'),
                        [
                            {text: i18n.t('okBtn')},
                        ],
                        {cancelable: false}
                    )
                }
            } else {
                this.setState({showImport: true});
            }
        }
    }

    public getMnemonic = async () => {
        Alert.alert(
            i18n.t('createWalletPopUpTitle'),
            i18n.t('createWalletPopUpInfo'),
            [
                {
                    text: i18n.t('cancelBtn'), onPress: async () => console.log("cancelled")
                },
                {
                    text: i18n.t('okBtn'), onPress: async () => {
                        const _mnemonic = await getMnemonic();
                        this.setState({mnemonicPhrase: _mnemonic});
                        this.setState({generateMnemonic: true});
                    }
                },
            ],
            {cancelable: false}
        )
    };

    public showMnemonic = async () => {
        if (this.state._showMnemonic) {
            this.setState({_showMnemonic: false});
        } else {
            Alert.alert(
                i18n.t('createWalletPopUpTitle'),
                i18n.t('createWalletPopUpInfo'),
                [
                    {
                        text: i18n.t('cancelBtn'), onPress: async () => console.log("cancelled")
                    },
                    {
                        text: i18n.t('okBtn'), onPress: async () => {
                            var m = this.state.wallet.mnemonic;
                            this.setState({mnemonicPhrase: m.split(' ')});
                            this.setState({_showMnemonic: true});
                        }
                    },
                ],
                {cancelable: false}
            )
        }
    };

    public showAccounts = async () => {
        if (this.state._showAccounts) {
            this.setState({_showAccounts: false});
        } else {
            this.setState({_showAccounts: true});
        }
    };

    public loadNewWallet = async (wallet: Wallet) => {
        this.setState({wallet: wallet});
    }

    public render() {
        const {children} = this.props;
        const value = {
            ...this.state,
            createWallet: this.createWallet,
            importWallet: this.importWallet,
            sendAsset: this.sendAsset,
            getMnemonic: this.getMnemonic,
            showMnemonic: this.showMnemonic,
            showConfirmScreen: this.showConfirmScreen,
            hideConfirmScreen: this.hideConfirmScreen,
            showAccounts: this.showAccounts,
            loadNewWallet: this.loadNewWallet,
        };
        return (
            <EthereumContext.Provider value={value}>
                {children}
            </EthereumContext.Provider>
        );
    }
}

export default EthereumProvider;
