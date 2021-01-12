import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_STORAGE_KEY = 'Ethereum.accountskey'
const CURRENT_ACCOUNT_KEY = 'Ethereum.currentacckey'
const PRIVATE_KEY_STORAGE_KEY = 'Ethereum.privatekey'
const MNEMONIC_STORAGE_KEY = 'Ethereum.mnemonic'

export class Account {
  name: string
  address: string
  privateKey: string
  mnemonics: string

  constructor(name: string, address: string, privateKey: string, mnemonics: string) {
    this.name = name
    this.address = address
    this.privateKey = privateKey
    this.mnemonics = mnemonics
  }
}

export class Accounts {
  accounts: Account[]                   // Array of accounts
  current: number                       // Current account index

  constructor() {
    this.accounts = []
    this.current = 0
    this.loadAccounts().then(() => {})
  }

  async loadAccounts() {
    try {
      console.log('Loading accounts...')
      const jsonAccounts = await SecureStore.getItemAsync(ACCOUNTS_STORAGE_KEY)
      const jsonCurrent = await SecureStore.getItemAsync(CURRENT_ACCOUNT_KEY)
      console.log('Value of accounts: ', jsonAccounts)

      if (jsonAccounts) {
        const objects = JSON.parse(jsonAccounts)
        for (let object of objects) {
          this.accounts.push(new Account(object.name, object.address, object.privateKey, object.mnemonics))
        }
        console.log("Parsed accounts = ", this.accounts)
      }
      if (jsonCurrent) {
        this.current = JSON.parse(jsonCurrent)
        console.log("Parsed current account index = ", this.current)
      }

      const currentAccount = this.accounts[this.current] as Account
      console.log("Current account = ", currentAccount)
      await this.loadAccount(currentAccount)
    } catch (e) {
      console.log(e)
    }
  }

  async loadAccount(account: Account) {
    await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, JSON.stringify(account.privateKey))
    await SecureStore.setItemAsync(MNEMONIC_STORAGE_KEY, JSON.stringify(account.mnemonics))
  }

  async addAccount(name: string, address: string, privateKey: string, mnemonic: string) {
    console.log("Adding account " + address)

    // Check if account exits
    const index = this.isAccountExist(privateKey)
    if (index < 0) {
      // Assign default name if not supplied
      if (name.length === 0) {
        name = "Account " + (this.accounts.length + 1)
      }
      this.accounts.push(new Account(name, address, privateKey, mnemonic))
      this.current = this.accounts.length - 1
      await SecureStore.setItemAsync(ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accounts))
      await SecureStore.setItemAsync(CURRENT_ACCOUNT_KEY, JSON.stringify(this.current))
      console.log('Account list: ', JSON.stringify(this.accounts))
      console.log('Current account: ', this.current)
    } else {
      console.log('Account ' + address + ' already exists!')
    }
  }

  async loadAccountAtIndex(index: number) {
    console.log("Loading account at index ", index)
    if (index < this.accounts.length) {
      this.current = index
      await SecureStore.setItemAsync(CURRENT_ACCOUNT_KEY, JSON.stringify(this.current))
      await this.loadAccount(this.accounts[index])
      return this.accounts[index]
    } else {
      return null
    }
  }

  getCurrentAccountIndex() {
    return this.current
  }

  isAccountExist(privateKey: string) {
    let accountExists: number = -1
    if (!privateKey || privateKey.length === 0) {
      return false
    }
    this.accounts.forEach(function (account, index) {
      if (account.privateKey.localeCompare(privateKey, undefined, { sensitivity: 'base' }) === 0) {
        accountExists = index
      }
    });
    return accountExists
  }

  async updateCurrentAccountName(name: string) {
    if (!name || name.length == 0) {
      console.log("Invalid name")
      return
    }
    const currentAccount = this.accounts[this.current]
    currentAccount.name = name
    this.accounts[this.current] = currentAccount
    await SecureStore.setItemAsync(ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accounts))
  }
}