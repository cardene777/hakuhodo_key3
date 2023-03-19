<template>
  <div class="app">
    <!-- サイドバー -->
    <div class="sidebar">
      <ul class="menu">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          :class="{ active: selectedItem === index }"
          @click="selectMenuItem(index)"
        >
          <font-awesome-icon :icon="item.icon" class="mr-2" />
          {{ item.label }}
        </li>
      </ul>
      <div class="logout" @click="logout">
        <font-awesome-icon icon="sign-out-alt" class="mr-1" />
        Log Out
      </div>
    </div>

    <!-- メインコンテンツ -->
    <div class="main">
      <!-- 検索欄 -->
      <div class="search-bar">
        <h1 class="welcome-guest">Welcome Guest</h1>
        <input class="search-input" type="text" placeholder="Search" />
      </div>

      <!-- 選択されたメニューに応じてコンテンツを表示 -->
      <div v-if="selectedItem === 0" class="my-project-list">
        <h2>My Projects</h2>
        <div class="project-container">
          <div v-for="(project, index) in followedProjects" :key="index" class="project-item">
            <div class="project-image">
              <img :src="project.image" alt="Project image" />
            </div>
            <div class="project-info">
              <h3>
                <router-link :to="{ name: 'project-details', params: { id: index } }">
                  {{ project.name }}
                </router-link>
              </h3>
              <p>{{ project.members }} members</p>
              <button
                class="follow-btn"
                :class="{ 'following': project.following }"
                @click="toggleFollow(index)"
              >
                {{ project.following ? "FOLLOWER" : "Follow" }}
              </button>
            </div>
          </div>
        </div>
        <button
          class="add-btn"
          @click="showProjectAddPopup = true"
        >
          <font-awesome-icon icon="plus" class="mr-1" />
          MY Project Add
        </button>
      </div>
      
      <!-- ProjectList -->
      <!-- 選択されたメニューに応じてコンテンツを表示 -->
      <div v-if="selectedItem === 1" class="project-list">
    <h2>Project List</h2>
    <div class="project-container">
      <div v-for="(project, index) in projects" :key="index" class="project-item">
        <div class="project-image">
          <img :src="project.logo" alt="Project image" />
        </div>
        <div class="project-info">
          <h3>
            <router-link :to="`/pj-info/${project.title}`">
            {{ project.title }}
            </router-link>
          </h3>
          <span class="members">{{ project.users }} members</span>
        </div>
        <button
          v-if="!project.following"
          class="follow-btn"
          @click="toggleFollow(index)"
        >
          Follow
        </button>
        <button
          v-else
          class="follow-btn following"
          @click="toggleFollow(index)"
        >
          Follower
        </button>
      </div>
    </div>
  </div>

  <!-- DAOPASS -->
      <div v-if="selectedItem === 2" class="dao-pass">
    <h2>My DAO PASS</h2>
    <button class="get-gas-fee-btn" @click="redirectToGasFee">
      ガス代の取得はこちら
    </button>
    <button class="free-mint-btn">
      <font-awesome-icon icon="plus" class="mr-1" />
      FREE MINT
    </button>
    <div class="dao-pass-description">
      <h3>DAO PASSを保有すると</h3>
      <ul>
        <li>✅分散型Projectに参加できます</li>
        <li>✅提案に投票できます</li>
        <li>✅ポイントは貯まります</li>
      </ul>
    </div>
  </div>
      
  <div v-if="showProjectAddPopup" class="popup-overlay" @click.self="closeProjectAddPopup">
    <div class="popup">
      <h2 class="popup-title">PJ Add</h2>
      <label for="name">PJ Name</label>
      <input id="name" type="text" v-model="projectName" />
      <label for="description">Description</label>
      <textarea id="description" v-model="projectDescription"></textarea>
      <label for="purpose">Purpose</label>
      <input id="purpose" type="text" v-model="projectPurpose" />
      <label for="deadline">Deadline</label>
      <input id="deadline" type="date" v-model="projectDeadline" />
      <label for="vote_deadline">Vote Deadline</label>
      <input id="vote_deadline" type="date" v-model="projectVoteDeadline" />
      <label for="phase">Phase</label>
      <input id="phase" type="number" v-model="projectPhase" />
      <button class="submit-btn" @click="submitProject">Submit</button>
    </div>
  </div>
  </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from 'vue';
import axios from "axios";


export default {
  setup() {
    const router = useRouter();
    const showProjectAddPopup = ref(false);
    const logoPreviewUrl = ref("");
    const projectName = ref("");
    const projectDescription = ref("");
    const projectMembers = ref("");
    const projectPurpose = ref("");
    const projectVoteDeadline = ref("");
    const projectDeadline = ref("");
    const projectPhase = ref(null);

    return {
      router,
      showProjectAddPopup,
      logoPreviewUrl,
      projectName,
      projectDescription,
      projectMembers,
      projectPurpose,
      projectVoteDeadline,
      projectDeadline,
      projectPhase,
    };
  },
  data() {
    return {
      followedProjects: [],
      selectedItem: 0,
      menuItems: [
        { label: 'MY PROJECT', icon: 'project-diagram' },
        { label: 'PROJECT LIST', icon: 'list' },
        { label: 'DAO PASS', icon: 'passport' },
        { label: 'Medicine Order', icon: 'prescription-bottle' },
        { label: 'Message', icon: 'envelope' },
        { label: 'Settings', icon: 'cog' },
      ],
      projects: [],
    };
  },
  mounted() {
    this.fetchProjects();
  },
  computed: {
    filteredProjects() {
      return this.projects.filter((project) => {
        return project.active === true;
      });
    },
  },
  methods: {
    selectMenuItem(index) {
      this.selectedItem = index;
      this.closeProjectAddPopup();
    },
    closeProjectAddPopup() {
      this.showProjectAddPopup = false;
    },
    logout() {
      // ログアウト処理をここに追加
    },
    goToMyProjectAdd() {
      this.router.push("/pj-add");
    },
    previewLogo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    this.logoPreviewUrl = e.target.result;
    const base64Image = e.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    this.logoData = {
      file: base64Image,
      type: file.type,
    };
  };
  reader.readAsDataURL(file);
},

onImageUploaded(response) {
      this.logoPreviewUrl = response.info.secure_url;
    },
    toggleFollow(index) {
      this.projects[index].following = !this.projects[index].following;
    },
    redirectToGasFee() {
      window.location.href = "https://portal.astar.network/astar/assets";
    },
    async fetchProjects() {
      try {
        const response = await axios.get("https://cardene7.pythonanywhere.com/api/projects/");
        this.projects = response.data;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    getRandomImageURL() {
      const randomNumber = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/id/${randomNumber}/200/300`;
    },

    async submitProject() {
      try {
        const requestData = {
          title: this.projectName,
          logo: this.getRandomImageURL(), // Use random image URL for logo
          description: this.projectDescription,
          purpose: this.projectPurpose,
          deadline: this.projectDeadline,
          vote_deadline: this.projectVoteDeadline,
          phase: this.projectPhase,
          invalid: false,
        };

        await axios.post('https://cardene7.pythonanywhere.com/api/projects/', requestData);

        this.projectName = '';
        this.projectDescription = '';
        this.projectPurpose = '';
        this.projectDeadline = '';
        this.projectVoteDeadline = '';
        this.projectPhase = null;
        this.closeProjectAddPopup();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>


<style scoped>
.app {
  display: flex;
}

.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
}

.menu {
  list-style-type: none;
  padding: 0;
}

.menu li {
  padding: 15px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #ccc;
}

.menu li i {
  margin-right: 10px;
}

.menu li.active {
  color: #28a745;
}

.logout {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #ccc;
}

.logout i {
  margin-right: 5px;
}

.main {
  flex: 1;
  padding: 20px;
}
.welcome-guest {
  font-size: 2rem;
  margin-right: auto;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #999;
  width: 250px;
}

.project-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.project-item {
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-image {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of the container */
}

.project-image img {
  position: absolute;
  top: 50px;
  left: 50px;
  bottom: 50px;
  right: 50px;
  width: 65%;
  height: 65%;
  object-fit: cover;
  border-radius: 5px;
}
.project-info {
  margin: 10px 0;
}

.project-info h3 {
  font-size: 1.2rem;
  margin: 0;
}

.members {
  font-size: 0.8rem;
  color: #999;
}

.follow-btn {
  background-color: #28a745;
  border: none;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.follow-btn:hover {
  background-color: #218838;
}

.follow-btn.following {
  background-color: #007bff;
}

.follow-btn.following:hover {
  background-color: #0069d9;
}

.add-btn {
  background-color: #28a745;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: auto;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  width: 80%;
  max-width: 400px;
  border-radius: 5px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.logo-label {
  cursor: pointer;
}

.logo-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  background-color: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.logo-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 10px;
}

.submit-btn {
  background-color: #28a745;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #218838;
}

label[for="purpose"] {
  margin-top: 10px;
}

.dao-pass-title {
  font-size: 2rem;
}

.get-gas-fee-btn,
.free-mint-btn {
  background-color: #28a745;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px 0 10px 20px;
}


.get-gas-fee-btn:hover,
.free-mint-btn:hover {
  background-color: #218838;
}

.dao-pass-description {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.dao-pass-description ul {
  list-style-type: none;
  padding: 0;
}

.dao-pass-description li {
  font-size: 1.2rem;
  padding: 5px 0;
  display: flex;
  align-items: center;
}

.dao-pass-description li i {
  margin-right: 10px;
}
/* レスポンシブ対応 */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .menu li {
    padding: 10px 5px;
    font-size: 14px;
  }

  .logout {
    left: 10px;
  }

  .main {
    padding: 10px;
  }

  .search-bar input {
    padding: 5px;
    font-size: 12px;
  }

  .project-list h2 {
    font-size: 1.5rem;
  }

  .add-btn {
    padding: 8px 16px;
    font-size: 14px;
    margin: 0 auto;
  }
  .welcome-guest {
    font-size: 1.5rem;
  }

  .search-input {
    padding: 5px 10px;
    font-size: 14px;
    width: 200px;
  }
}

</style>
