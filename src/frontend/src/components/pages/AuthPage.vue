<template>
  <div id="app">
    <header>
      <div class="header__top">
        <!-- 上段のヘッダー -->
      </div>
      <div class="header__bottom">
        <!-- 下段のヘッダー -->
        <button v-if="isConnected && !gmail" class="header__login-btn" @click="showModal = true">ログイン</button>
        <p v-else>
          <w3m-core-button />
        </p>
      </div>
    </header>
    <div class="login-modal" v-if="showModal">
  <h2 class="login-modal__title">ログイン</h2>
  <GoogleLogin :callback="callback"/>
  <div>
    <button class="close-btn" @click="showModal = false">閉じる</button>
  </div>
</div>


<main class="main-content" :style="mainContentStyle">
  <div class="main-content__text">
    <div class="DAOtext">
    <h1>DAO </h1>
    <h1>Hackathon</h1>
    </div>
    <div class="abaut">
    <p>
      We handle everything from home blood test,
      online diagnostics to prescriptions delivery.</p>
    </div>

    <main class="main-content" :style="mainContentStyle">
      <div class="main-content__text">
        <div class="DAOtext">
          <h1>DAO </h1>
          <h1>Hackathon</h1>
        </div>
        <div class="abaut">
          <p>
            We handle everything from home blood test,
            online diagnostics to prescriptions delivery.</p>
        </div>
        <!-- <button>LEARN MORE</button> -->
      </div>
    </main>
  </div>
</template>

<script>
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { decodeCredential } from 'vue3-google-login'
import { Web3Modal } from "@web3modal/html";
import { configureChains, createClient, getAccount } from "@wagmi/core";
import { goerli } from "@wagmi/core/chains";
import axios from 'axios';
import abi from '../../abi/contracts/DaoPass.json';
import { ethers } from 'ethers'

const contractABI = abi.abi
const contractAddress = '0xE8E9a8b52Db9C8afEF0e2F8DC288CF2B9DF27Cb3'

export default {
  setup() {
    try {
      const chains = [goerli];
      const projectId = process.env.VUE_APP_PRODUCT_ID;

      const { provider } = configureChains(chains, [
        w3mProvider({ projectId }),
      ]);

      const wagmiClient = createClient({
        autoConnect: true,
        connectors: w3mConnectors({ projectId, version: 1, chains }),
        provider,
      });
      const ethereumClient = new EthereumClient(wagmiClient, chains);
      const web3modal = new Web3Modal({ projectId }, ethereumClient);

      const getUserData = async (walletAddress) => {
        try {
          const userData = await axios.get(`https://cardene7.pythonanywhere.com/api/users/${walletAddress}`)
          if (userData.data) {
              console.log(`userData.data ${JSON.stringify(userData.data)}`)
              return userData.data
            }
            return false
        } catch (error) {
          console.log(error)
        }
        return false
      }

      const mintSBT = async () => {
        try {
          const { ethereum } = window
          if (ethereum) {
            let tokenTotalSupply = 0
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const contractWrite = new ethers.Contract(contractAddress, contractABI, signer)
            await contractWrite.mintToken().then(async () => {
              const contractRead = new ethers.Contract(contractAddress, contractABI, provider);
              tokenTotalSupply = await contractRead.totalSupply()
            })

            return tokenTotalSupply
          }
          return 0
        } catch (error) {
          console.log(error)
          return 0
        }
      }

      const account = getAccount()

      // const checkHaveSbt = async (address) => {
      //   const { ethereum } = window
      //   const provider = new ethers.providers.Web3Provider(ethereum)
      //   const contractRead = new ethers.Contract(contractAddress, contractABI, provider);
      //   const haveSbt = await contractRead.isMinted(address)
      //   return haveSbt
      // }

      const callback = async (response) => {
        const userData = decodeCredential(response.credential)
        console.log(`userData`)
        const tokenTotalSupply = await mintSBT()
        const haveSbt = await getUserData(account.address)
        if (!haveSbt && tokenTotalSupply) {
          const userTokenId = Number(parseInt(tokenTotalSupply, 10)) + 1
          await axios.post('https://cardene7.pythonanywhere.com/api/users/',
            {
              wallet_address: account.address,
              email: userData.email,
              tokenId: userTokenId
            }
          )
          .then(response => {
            console.log(`response.data ${JSON.stringify(response.data)}`)
          })
          .catch(error => {
            console.log(error)
          })
        }
      }


      return {
        web3modal,
        callback,
        mintSBT,
        // checkHaveSbt,
        // getUserData,
      }
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    const account = getAccount()
    console.log(`account ${JSON.stringify(account)}`)
    const userData = async (walletAddress) => {
        try {
          const userData = await axios.get(`https://cardene7.pythonanywhere.com/api/users/${walletAddress}`)
          if (userData.data) {
              console.log(`userData.data ${JSON.stringify(userData.data)}`)
              return Promise.resolve(true)
            }
            return Promise.resolve(false)
        } catch (error) {
          console.log(error)
          return Promise.resolve(false)
        }
    }
    let isEmail = false;
    userData(account.address).then((res) => {
      isEmail = res
    })
    return {
      showModal: false,
      gmail: isEmail,
      walletAddress: '',
      users: [],
      mainContentStyle: {
        backgroundImage: 'url(../../assets/Header.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      },
      isConnected: account.isConnected
    };
  },
};
</script>

<style scoped>
.header__top {
  background-color: #3B00DD;
  height: 40px;
}

.header__bottom {
  background-color: #ffffff;
  height: 80px;
  border-bottom: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.header__login-btn {
  padding: 0.5rem 2rem;
  font-size: 1rem;
  cursor: pointer;
}

.login-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 300px;
  }

  .login-modal__title {
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
  }

  .connect-wallet-btn {
    font-family: 'Poppins', sans-serif;
    font-size: 20px;
    font-weight: 500;
    background-color: #3B00DD;
    color: #fff;
    border: none;
    border-radius: 9px;
    padding: 8px 16px;
    cursor: pointer;
    margin-bottom: 1rem;
    padding: 0.5rem 2rem;
  }

  .input-container {
    margin-bottom: 1rem;
  }

  .input-container label {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 4px;
  }

  .input-container input {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    padding: 8px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }

  .login-btn {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    background-color: #3B00DD;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 1rem;
  }

  .close-btn {
    font-family: 'Poppins', sans-serif;
font-size: 14px;
font-weight: 500;
background-color: #ccc;
color: #333;
border: none;
border-radius: 4px;
padding: 8px 16px;
cursor: pointer;
width: 100%;
}
.main-content {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 4rem;
  height: 100vh;
  text-align: center;
}

.main-content__text {
  max-width: 600px;
}

.DAOtext{
position: absolute;
left: 8.46%;
right: 70%;
top: 40%;
bottom: 50%;
font-family: 'Poppins';
font-style: normal;
font-weight: auto;
font-size: auto;
line-height: 80px;
letter-spacing: -0.5px;
color: rgba(0, 0, 0, 0.87);
text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

}
.about{
    position: absolute;
left: 10%;
right: 64.91%;
top: 53.64%;
bottom: 36.48%;

font-family: 'Poppins';
font-style: normal;
font-weight: 500;
font-size: 19.1768px;
line-height: 29px;
letter-spacing: 0.25px;

color: rgba(0, 0, 0, 0.6);
}
</style>
