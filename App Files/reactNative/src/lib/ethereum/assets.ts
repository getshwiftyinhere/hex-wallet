import { ethers } from 'ethers'
import { Networks } from './network'
import erc20ABI, { ERC20Contract } from './contracts/erc20'
import { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType, Percent } from '@uniswap/sdk'
import { Linking } from "react-native";
import i18n from "i18n-js";

export enum AssetType {
  eth = 'ETH',
  hex = 'HEX'
}

export default class AssetContract {
  static hexContractAddress = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39";
  static hexAbi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data1",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes20",
          "name": "btcAddr",
          "type": "bytes20"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "claimToAddr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrerAddr",
          "type": "address"
        }
      ],
      "name": "Claim",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data1",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data2",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "senderAddr",
          "type": "address"
        }
      ],
      "name": "ClaimAssist",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "updaterAddr",
          "type": "address"
        }
      ],
      "name": "DailyDataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint40",
          "name": "stakeId",
          "type": "uint40"
        }
      ],
      "name": "ShareRateChange",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data1",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "stakerAddr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint40",
          "name": "stakeId",
          "type": "uint40"
        }
      ],
      "name": "StakeEnd",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data1",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "stakerAddr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint40",
          "name": "stakeId",
          "type": "uint40"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "senderAddr",
          "type": "address"
        }
      ],
      "name": "StakeGoodAccounting",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "stakerAddr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint40",
          "name": "stakeId",
          "type": "uint40"
        }
      ],
      "name": "StakeStart",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "memberAddr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrerAddr",
          "type": "address"
        }
      ],
      "name": "XfLobbyEnter",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data0",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "memberAddr",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "referrerAddr",
          "type": "address"
        }
      ],
      "name": "XfLobbyExit",
      "type": "event"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "allocatedSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "rawSatoshis",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "proof",
          "type": "bytes32[]"
        },
        {
          "internalType": "address",
          "name": "claimToAddr",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "pubKeyX",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "pubKeyY",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "claimFlags",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "autoStakeDays",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "referrerAddr",
          "type": "address"
        }
      ],
      "name": "btcAddressClaim",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes20",
          "name": "",
          "type": "bytes20"
        }
      ],
      "name": "btcAddressClaims",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes20",
          "name": "btcAddr",
          "type": "bytes20"
        },
        {
          "internalType": "uint256",
          "name": "rawSatoshis",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "proof",
          "type": "bytes32[]"
        }
      ],
      "name": "btcAddressIsClaimable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes20",
          "name": "btcAddr",
          "type": "bytes20"
        },
        {
          "internalType": "uint256",
          "name": "rawSatoshis",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "proof",
          "type": "bytes32[]"
        }
      ],
      "name": "btcAddressIsValid",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "claimToAddr",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "claimParamHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "pubKeyX",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "pubKeyY",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "claimFlags",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "claimMessageMatchesSignature",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "currentDay",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "dailyData",
      "outputs": [
        {
          "internalType": "uint72",
          "name": "dayPayoutTotal",
          "type": "uint72"
        },
        {
          "internalType": "uint72",
          "name": "dayStakeSharesTotal",
          "type": "uint72"
        },
        {
          "internalType": "uint56",
          "name": "dayUnclaimedSatoshisTotal",
          "type": "uint56"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "beginDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endDay",
          "type": "uint256"
        }
      ],
      "name": "dailyDataRange",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "list",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "beforeDay",
          "type": "uint256"
        }
      ],
      "name": "dailyDataUpdate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "globalInfo",
      "outputs": [
        {
          "internalType": "uint256[13]",
          "name": "",
          "type": "uint256[13]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "globals",
      "outputs": [
        {
          "internalType": "uint72",
          "name": "lockedHeartsTotal",
          "type": "uint72"
        },
        {
          "internalType": "uint72",
          "name": "nextStakeSharesTotal",
          "type": "uint72"
        },
        {
          "internalType": "uint40",
          "name": "shareRate",
          "type": "uint40"
        },
        {
          "internalType": "uint72",
          "name": "stakePenaltyTotal",
          "type": "uint72"
        },
        {
          "internalType": "uint16",
          "name": "dailyDataCount",
          "type": "uint16"
        },
        {
          "internalType": "uint72",
          "name": "stakeSharesTotal",
          "type": "uint72"
        },
        {
          "internalType": "uint40",
          "name": "latestStakeId",
          "type": "uint40"
        },
        {
          "internalType": "uint128",
          "name": "claimStats",
          "type": "uint128"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "merkleLeaf",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32[]",
          "name": "proof",
          "type": "bytes32[]"
        }
      ],
      "name": "merkleProofIsValid",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "pubKeyX",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "pubKeyY",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "claimFlags",
          "type": "uint8"
        }
      ],
      "name": "pubKeyToBtcAddress",
      "outputs": [
        {
          "internalType": "bytes20",
          "name": "",
          "type": "bytes20"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "pubKeyX",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "pubKeyY",
          "type": "bytes32"
        }
      ],
      "name": "pubKeyToEthAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "stakerAddr",
          "type": "address"
        }
      ],
      "name": "stakeCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint40",
          "name": "stakeIdParam",
          "type": "uint40"
        }
      ],
      "name": "stakeEnd",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "stakerAddr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "stakeIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint40",
          "name": "stakeIdParam",
          "type": "uint40"
        }
      ],
      "name": "stakeGoodAccounting",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stakeLists",
      "outputs": [
        {
          "internalType": "uint40",
          "name": "stakeId",
          "type": "uint40"
        },
        {
          "internalType": "uint72",
          "name": "stakedHearts",
          "type": "uint72"
        },
        {
          "internalType": "uint72",
          "name": "stakeShares",
          "type": "uint72"
        },
        {
          "internalType": "uint16",
          "name": "lockedDay",
          "type": "uint16"
        },
        {
          "internalType": "uint16",
          "name": "stakedDays",
          "type": "uint16"
        },
        {
          "internalType": "uint16",
          "name": "unlockedDay",
          "type": "uint16"
        },
        {
          "internalType": "bool",
          "name": "isAutoStake",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newStakedHearts",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newStakedDays",
          "type": "uint256"
        }
      ],
      "name": "stakeStart",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "xfLobby",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "referrerAddr",
          "type": "address"
        }
      ],
      "name": "xfLobbyEnter",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "memberAddr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        }
      ],
      "name": "xfLobbyEntry",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "rawAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "referrerAddr",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "enterDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "xfLobbyExit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "xfLobbyFlush",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "xfLobbyMembers",
      "outputs": [
        {
          "internalType": "uint40",
          "name": "headIndex",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "tailIndex",
          "type": "uint40"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "memberAddr",
          "type": "address"
        }
      ],
      "name": "xfLobbyPendingDays",
      "outputs": [
        {
          "internalType": "uint256[2]",
          "name": "words",
          "type": "uint256[2]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "beginDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endDay",
          "type": "uint256"
        }
      ],
      "name": "xfLobbyRange",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "list",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  static usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  static usdcAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ];

  static usdcExchange = '0x58FB06D2A2BFE9ceEd68A7D8fa051D18335F8aA0';
  static usdcExchangeAbi = [
    {
      "inputs": [
        {
          "internalType": "contract HXY",
          "name": "_hxyToken",
          "type": "address"
        },
        {
          "internalType": "contract IERC20",
          "name": "_usdcToken",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "_dividendsContract",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_uniswapEth",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_uniswapUsdc",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_adminAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "DEPLOYER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "SECONDS_IN_DAY",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getDividendsContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getHxyTokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getMaxAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getMinAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getRoleMember",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleMemberCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getWhitelistAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newAmount",
          "type": "uint256"
        }
      ],
      "name": "setMaxAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newAmount",
          "type": "uint256"
        }
      ],
      "name": "setMinAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUniswapGetterInstanceEth",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getUniswapGetterInstanceUsdc",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "getConvertedAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getUsdcTokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "exchangeUsdc",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_uniswapGetterInstanceEth",
          "type": "address"
        }
      ],
      "name": "setUniswapGetterInstanceEth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_uniswapGetterInstanceUsdc",
          "type": "address"
        }
      ],
      "name": "setUniswapGetterInstanceUsdc",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  static uniAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "exchangeAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "exchange",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ethSold",
          "type": "uint256"
        }
      ],
      "name": "getEthToTokenInputPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokensBought",
          "type": "uint256"
        }
      ],
      "name": "getEthToTokenOutputPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokensSold",
          "type": "uint256"
        }
      ],
      "name": "getTokenToEthInputPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ethBought",
          "type": "uint256"
        }
      ],
      "name": "getTokenToEthOutputPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  static uniRouterContractAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  static uniRouterAbi = [{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];

  static usdcUni = "0xe68D8D9bFB289a732ed4E202ba042Ddfbd689e7C";

  static wethContractAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
}

export interface Asset {
  type: AssetType
  balance: number,
}

const TOKENS = {
  [Networks.homestead]: {
    [AssetType.hex]: AssetContract.hexContractAddress
  }
}

export const sendEther = async (args: { wallet: ethers.Wallet, to: string, amount: number }): Promise<ethers.providers.TransactionResponse> => {
  const { wallet, to, amount } = args
  const network = await wallet.provider.getNetwork()
  const transaction = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount.toString()),
    chainId: network.chainId
  });
  return transaction
}

export const sendToken = async (args: { wallet: ethers.Wallet, to: string, amount: number, type: AssetType }): Promise<ethers.providers.TransactionResponse> => {
  const { wallet, to, amount, type } = args

  if (type === AssetType.eth) throw new Error('Use sendEther function to send ETH')

  const network = await wallet.provider.getNetwork()
  const tokenAddress = TOKENS[network.name as Networks][type]
  const contract = new ethers.Contract(tokenAddress, erc20ABI, wallet) as ERC20Contract
  const decimals = await contract.decimals()
  const transaction = await contract.transfer(to, ethers.utils.parseUnits(amount.toString(), decimals))
  return transaction
}

export const stakeHEX = async (wallet: ethers.Wallet, amount: number, stakeDays: number): Promise<ethers.providers.TransactionResponse> => {
  const network = await wallet.provider.getNetwork()
  const tokenAddress = AssetContract.hexContractAddress;
  const contract = new ethers.Contract(tokenAddress, AssetContract.hexAbi, wallet) as ERC20Contract
  const decimals = await contract.decimals()
  const transaction = await contract.stakeStart(ethers.utils.parseUnits(amount.toString(), decimals), stakeDays)
  return transaction
}

export const endStake = async (wallet: ethers.Wallet, stakeId: number, stakeIndex: number): Promise<ethers.providers.TransactionResponse> => {
  const tokenAddress = AssetContract.hexContractAddress;
  const contract = new ethers.Contract(tokenAddress, AssetContract.hexAbi, wallet) as ERC20Contract
  const transaction = await contract.stakeEnd(stakeIndex, stakeId)
  return transaction
}

export const buyHex = async (wallet: ethers.Wallet, amount: number) => {

  const HEX = new Token(ChainId.MAINNET, AssetContract.hexContractAddress, 8)

  //const pair = await Fetcher.fetchPairData(HEX, WETH[HEX.chainId])

  //const route = new Route([pair], WETH[HEX.chainId])
  const amountIn = ethers.utils.parseUnits(amount.toString(), 18);
  console.log(amountIn);
  //const trade = new Trade(route, new TokenAmount(WETH[HEX.chainId], amountIn), TradeType.EXACT_INPUT)
  //console.log(trade);
  //const slippageTolerance = new Percent('100', '10000') // 100 bips, or 1%
  //console.log(slippageTolerance);
  //const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
  //console.log(amountOutMin);
  //const path = [AssetContract.hexContractAddress, AssetContract.wethContractAddress]
  const path = [WETH[HEX.chainId].address, HEX.address]
  console.log(path);
  const to = wallet.address // should be a checksummed recipient address
  console.log(to);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
  console.log(deadline);
  //const v = trade.inputAmount.raw // // needs to be converted to e.g. hex
  const contract = new ethers.Contract(AssetContract.uniRouterContractAddress, AssetContract.uniRouterAbi, wallet) as ERC20Contract
  let overrides = {

    // The maximum units of gas for the transaction to use
    //gasLimit: 23000,

    // The price (in wei) per unit of gas
    //gasPrice: utils.parseUnits('9.0', 'gwei'),

    // The nonce to use in the transaction
    //nonce: 123,

    // The amount to send with the transaction (i.e. msg.value)
    value: amountIn,

    // The chain ID (or network ID) to use
    //chainId: 1

};
  console.log(overrides);
  var transaction = contract.swapExactETHForTokens(0, path, to, deadline, overrides)
  wallet.sendTransaction(transaction).then((tx) => {
    let url = i18n.t('etherscanTx') + tx.hash;
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        } else {
            console.log("Don't know how to open URI: " + url);
        }
    });
  });
}
  //var path = new String[](2);
  //path[0] = AssetContract.wethContractAddress;
  //path[1] = AssetContract.hexContractAddress;
  //const tokenAddress = AssetContract.hexExchange;
  //const contract = new ethers.Contract(tokenAddress, AssetContract.hexExchangeAbi, wallet) as ERC20Contract;
  //var v = ethers.utils.parseUnits(amount.toString(), 18);
  //const transaction = await contract.swapExactETHForTokens{value:v}(0, path, wallet.address, ((Date.now()/1000) + 800));

export const sellHex = async (wallet: ethers.Wallet, amount: number) => {

  const HEX = new Token(ChainId.MAINNET, AssetContract.hexContractAddress, 8)

  //const pair = await Fetcher.fetchPairData(HEX, WETH[HEX.chainId])

  //const route = new Route([pair], WETH[HEX.chainId])

  const amountIn = ethers.utils.parseUnits(amount.toString(), 8);

  //const trade = new Trade(route, new TokenAmount(WETH[HEX.chainId], amountIn), TradeType.EXACT_INPUT)

 // const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.05%

  //const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
  const path = [HEX.address, WETH[HEX.chainId].address]
  const to = wallet.address // should be a checksummed recipient address
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
  //const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
  const contract = new ethers.Contract(AssetContract.uniRouterContractAddress, AssetContract.uniRouterAbi, wallet) as ERC20Contract;
  //const transaction = await contract.swapExactTokensForETH(value, amountOutMin, path, to, deadline);
  var transaction = contract.swapExactTokensForETH(amountIn, 0, path, to, deadline);
  wallet.sendTransaction(transaction).then(function(tx){
    let url = i18n.t('etherscanTx') + tx.hash;
    console.log(url);
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        } else {
            console.log("Don't know how to open URI: " + url);
        }
    });
  });
  //var path = new String[](2);
  //path[0] = AssetContract.wethContractAddress;
  //path[1] = AssetContract.hexContractAddress;
  //const tokenAddress = AssetContract.hexExchange;
  //const contract = new ethers.Contract(tokenAddress, AssetContract.hexExchangeAbi, wallet) as ERC20Contract;
  //var v = ethers.utils.parseUnits(amount.toString(), 18);
  //const transaction = await contract.swapExactETHForTokens{value:v}(0, path, wallet.address, ((Date.now()/1000) + 800));
}

export const getEtherBalance = async (wallet: ethers.Wallet): Promise<number> => {
  const balance = await wallet.provider.getBalance(wallet.address)
  return Number(ethers.utils.formatEther(balance))
}

export const getTokenBalance = async (tokenAddress: string, wallet: ethers.Wallet): Promise<number> => {
  const contract = new ethers.Contract(tokenAddress, erc20ABI, wallet) as ERC20Contract
  const balance: ethers.utils.BigNumber = await contract.balanceOf(wallet.address);
  const decimals: number = await contract.decimals()
  const tokenBalance = ethers.utils.formatUnits(balance, decimals)
  return Number(tokenBalance)
}

export const loadAssets = async (assets: AssetType[], wallet: ethers.Wallet): Promise<Asset[]> => {
  const network = await wallet.provider.getNetwork()
  const tokensAddresses = TOKENS[network.name as Networks]
  return await Promise.all(assets.map(async (asset: AssetType) => {
    if (asset === AssetType.eth) {
      return {
        type: asset,
        balance: await getEtherBalance(wallet)
      }
    } else {
      return {
        type: asset,
        balance: await getTokenBalance(tokensAddresses[asset], wallet)
      }
    }
  }))
}