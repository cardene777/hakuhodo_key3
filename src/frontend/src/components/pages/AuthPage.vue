<template>
  <div id="app">
    <header>
      <div class="header__top">
        <!-- 上段のヘッダー -->
      </div>
      <div class="header__bottom">
        <!-- 下段のヘッダー -->
        <button class="header__login-btn" @click="showModal = true">ログイン</button>
      </div>
    </header>
    <div class="login-modal" v-if="showModal">
      <h2 class="login-modal__title">ログイン</h2>
      <button
        class="connect-wallet-btn"
        @click="connectWallet"
        v-if="!walletAddress"
      >
        Connect Wallet
      </button>
      <div v-if="walletAddress">{{ walletAddress }}</div>
      <div class="input-container">
        <label for="gmail-input">Gmail</label>
        <input id="gmail-input" v-model="gmail">
      </div>
      <button class="login-btn" @click="login">ログイン</button>
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
        <!-- <button>LEARN MORE</button> -->
      </div>
    </main>
  </div>
</template>
<script>
import Web3 from 'web3';
import axios from 'axios';

export default {
  data() {
    return {
      showModal: false,
      gmail: '',
      walletAddress: '',
      users: [],
      mainContentStyle: {
        backgroundImage: 'url(../../assets/Header.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      },
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get('https://cardene7.pythonanywhere.com/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error getting users:', error);
      }
    },
    async login() {
      console.log('Login button clicked', this.gmail);
      await this.postUser(this.walletAddress);
      this.showModal = false;
      this.$router.push('/my-page');
    },
    async connectWallet() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          this.walletAddress = accounts[0];
          console.log('Wallet address:', this.walletAddress);

          const matchingUser = this.users.find((user) => user.wallet_address === this.walletAddress);
          if (matchingUser) {
            this.$router.push('/my-page');
          }
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected.');
      }
    },
    async postUser(walletAddress) {
      const lastUser = this.users[this.users.length - 1];
      const nextTokenId = lastUser ? lastUser.tokenId + 1 : 1;

      const requestData = {
        wallet_address: walletAddress,
        email: this.gmail,
        tokenId: nextTokenId,
      };

      try {
        const response = await axios.post(
          'https://cardene7.pythonanywhere.com/api/users',
          requestData
        );
        console.log('User posted:', response.data);
        this.showModal = false;
      } catch (error) {
        console.error('Error posting user:', error);
      }
    },
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