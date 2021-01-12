import * as SecureStore from 'expo-secure-store';
import {ethers} from 'ethers'
import {AssetType, sendEther, sendToken} from './assets'
import {getNetwork} from './network'
import {Account, Accounts} from './accounts'

const PRIVATE_KEY_STORAGE_KEY = 'Ethereum.privatekey'
const MNEMONIC_STORAGE_KEY = 'Ethereum.mnemonic'
var _mnemonics = ['',''];
export enum WalletStorageType {
  privateKey = 'PRIVATE_KEY',
  mnemonics = 'MNEMONICS'
}

let accountList = new Accounts()

const generateMnemonics = () => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16)).split(' ')
}

const loadWalletFromMnemonics = async (mnemonics: string[]) => {
  const provider = ethers.getDefaultProvider(getNetwork())
  provider.getBalance = provider.getBalance.bind(provider)
  const wallet = ethers.Wallet.fromMnemonic(mnemonics.join(' ')).connect(provider)
  await accountList.addAccount("", wallet.address, wallet.privateKey, wallet.mnemonic)
  return wallet
}

export const loadWalletFromPrivateKey = async (privateKey: string): Promise<ethers.Wallet> => {
  const provider = ethers.getDefaultProvider(getNetwork())
  provider.getBalance = provider.getBalance.bind(provider)
  const wallet = new ethers.Wallet(privateKey, provider)
  await accountList.addAccount("", wallet.address, wallet.privateKey, wallet.mnemonic)
  return wallet
}

export const getMnemonic = async () => {
  _mnemonics = await generateMnemonics();
  return _mnemonics;
}

export const createWallet = async (): Promise<ethers.Wallet> => {
  const wallet = await loadWalletFromMnemonics(_mnemonics);
  await SecureStore.setItemAsync(MNEMONIC_STORAGE_KEY, JSON.stringify(wallet.mnemonic));
  await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, JSON.stringify(wallet.privateKey));
  return wallet;
}

export const importWallet = async (seed: string[]): Promise<ethers.Wallet> => {
  console.log(seed);
  const wallet = await loadWalletFromMnemonics(seed);
  console.log(wallet);
  await SecureStore.setItemAsync(MNEMONIC_STORAGE_KEY, JSON.stringify(wallet.mnemonic));
  await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, JSON.stringify(wallet.privateKey));
  return wallet;
}

export const loadWallet = async (type: WalletStorageType, mnemonics?: string[]): Promise<ethers.Wallet> => {
  switch(type) {
    case WalletStorageType.privateKey:
      const privateKey = await SecureStore.getItemAsync(PRIVATE_KEY_STORAGE_KEY)
      if (!privateKey) throw new Error(`No private key in storage`)
      return loadWalletFromPrivateKey(JSON.parse(privateKey))
    case WalletStorageType.mnemonics:
      let m = await SecureStore.getItemAsync(MNEMONIC_STORAGE_KEY);
      m = m.slice(1, m.length - 1);
      const phrase = m.split(' ') as String[];
      if (!phrase) throw new Error(`No mnemonics provided`)
      return loadWalletFromMnemonics(phrase)
  }
}

export const sendAsset = async (args: { wallet: ethers.Wallet, to: string, amount: number, type: AssetType }): Promise<ethers.providers.TransactionResponse> => {
  const { type } = args
  return type === AssetType.eth ? sendEther(args) : sendToken(args)
}

export const getAccounts = (): Accounts => {
  return accountList
}

export const getCurrentAccount = (): Account => {
  const current = accountList.getCurrentAccountIndex()
  return accountList.accounts[current]
}

export const loadAccountAtIndex = async (index: number) => {
  return accountList.loadAccountAtIndex(index)
}

export const changeCurrentAccountName = async (name: string) => {
  await accountList.updateCurrentAccountName(name)
}