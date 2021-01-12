const CoinpaprikaAPI = require('@coinpaprika/api-nodejs-client');
const client = new CoinpaprikaAPI();

var yuanUsd = 0;
var hexUsd = 0;
var ethUsd = 0;
var hexPerEth = 0;
var aaEth;

getPrice();
setInterval(function(){
  getPrice();
}, 30000);

async function getPrice(){
  //var currentDay = await hexContract.methods.currentDay().call();
  //aaEth = await hexContract.methods.xfLobby(currentDay).call();
  var result = await client.getTicker({coinId: 'hex-hex'});
  hexUsd = result.price_usd;
  result = await client.getTicker({coinId: 'eth-ethereum'});
  ethUsd = result.price_usd;
  hexPerEth = ethUsd / hexUsd;
  console.log(hexPerEth);
  fetch('https://api.exchangeratesapi.io/latest?base=USD')
    .then((response) => response.json())
    .then((json) => {
      yuanUsd = json.rates.CNY;
    })
    .catch((error) => {
      console.error(error);
    });
}