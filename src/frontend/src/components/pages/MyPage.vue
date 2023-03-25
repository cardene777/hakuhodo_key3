<template>
  <div class="app">
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
    <div class="main">
      <div class="search-bar">
        <h1 class="welcome-guest">Welcome to {{ account }} </h1>
        <input class="search-input" type="text" placeholder="Search" />
      </div>
      <small class="current-date">{{ currentDate }}</small>

<!-- MY PROJECT -->
<div v-if="selectedItem === 0" class="my-project-list">
  <div class="project-container">
    <div v-for="(project, index) in filteredProjects" :key="index" class="project-item">
      <div class="project-image">
        <img :src="project.logo" alt="Project image" />
      </div>
      <div class="project-info">
        <div class="phase-container">
          <div class="phase" :class="`phase-color-${project.phase}`">{{ project.phase }}</div>
        </div>
        <h3>
          <router-link :to="`/pj-info/${project.pk}`">
            {{ project.title }}
          </router-link>
        </h3>
        <span class="members">members {{ project.users }}</span>
      </div>
      <button v-if="!project.following" class="follow-btn" @click="toggleFollow(project)">
        Follow
      </button>
      <button v-else class="follow-btn following" @click="toggleFollow(project)">
        Follower
      </button>
    </div>
  </div>
  <button class="add-btn" @click="showProjectAddPopup = true">
    <font-awesome-icon icon="plus" class="mr-1" />
    MY Project Add
  </button>
</div>

<!-- PROJECT LIST -->
<div v-if="selectedItem === 1" class="project-list">
  <div class="project-container">
    <div v-for="(project, index) in projects" :key="index" class="project-item">
      <div class="project-image">
        <img :src="project.logo" alt="Project image" />
      </div>
      <div class="project-info">
        <div class="phase-container">
          <div class="phase" :class="`phase-color-${project.phase}`">{{ project.phase }}</div>
        </div>
        <h3>
          <router-link :to="`/pj-info/${project.pk}`">
            {{ project.title }}
          </router-link>
        </h3>
        <span class="members">members {{ project.users }}</span>
      </div>
      <button v-if="!project.following" class="follow-btn" @click="toggleFollow(project)">
        Follow
      </button>
      <button v-else class="follow-btn following" @click="toggleFollow(project)">
        Follower
      </button>
    </div>
  </div>
</div>

<!-- DAO PASS -->
<div v-if="selectedItem === 2" class="dao-pass">
  <div class="dao-pass-block">
    <h2>MY Reward</h2>
    <div class="additional-blocks">
      <div class="additional-block">
        <h3>FOLLOWED PJ</h3>
        <p>{{ followedProjectsCount }} PJ</p>
      </div>
      <div class="additional-block">
        <h3>Onchain Point</h3>
        <p>{{ onchainPoints }} BCP</p>
      </div>
    </div>
  </div>
</div>

<div v-if="showProjectAddPopup" class="popup-overlay" @click.self="closeProjectAddPopup">
  <div class="popup">
    <div class="popup-inner">
      <h2 class="popup-title">PJ Add</h2>
      <label for="logo">Project Logo</label>
      <input id="logo" type="file" accept="image/*" @change="previewLogo" />
      <div class="logo-preview" v-if="logoPreviewUrl">
        <img :src="logoPreviewUrl" alt="Logo Preview" />
      </div>
      <label for="name">Project Name</label>
      <input id="name" type="text" v-model="projectName" />
      <label for="description">Description</label>
      <textarea id="description" v-model="projectDescription"></textarea>
      <label for="description_img">Project Description Image</label>
      <input id="description_img" type="file" accept="image/*" @change="previewDescriptionImage" />
      <div class="description-img-preview" v-if="descriptionImagePreviewUrl">
        <img :src="descriptionImagePreviewUrl" alt="Description Image Preview" />
      </div>
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
</div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
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
    const account = ref(null);
    const logoData = ref(null);
    const descriptionImagePreviewUrl = ref("");
    const descriptionImageData = ref(null);
    const currentDate = ref(new Date().toLocaleDateString());

    onMounted(async () => {
      account.value = await window.ethereum.request({ method: "eth_accounts" });
    });

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
      account,
      logoData,
      descriptionImagePreviewUrl,
      descriptionImageData,
      currentDate,
    };
  },
  
  data() {    
    return {
      onchainPoints: 0,
      followedProjects: [],
      selectedItem: 0,
      menuItems: [
        { label: 'MY PROJECT', icon: 'project-diagram' },
        { label: 'PROJECT LIST', icon: 'list' },
        { label: 'DAO PASS', icon: 'passport' },
      ],
      projects: [],
    };
  },
  mounted() {
    this.fetchProjects();
    this.fetchOnchainPoints();
  },
  computed: {
  filteredProjects() {
    return this.projects.filter((project) => {
      return project.following === true;
    });
  },
  followedProjectsCount() {
    return this.filteredProjects.length;
  },
  },
  methods: {

    async fetchOnchainPoints() {
  try {
    const userAddress = await window.ethereum.request({ method: "eth_accounts" });
    const userResponse = await axios.get(
      `https://cardene7.pythonanywhere.com/api/users/${userAddress[0]}`
    );
    const currentUser = userResponse.data;

    const response = await axios.get("https://cardene7.pythonanywhere.com/api/votes/");
    const votes = response.data;

    const matchingVotes = votes.filter((vote) => vote.users === currentUser.pk);
    this.onchainPoints = matchingVotes.length;
  } catch (error) {
    console.error("Error fetching onchain points:", error);
  }
},


    selectMenuItem(index) {
      this.selectedItem = index;
      this.closeProjectAddPopup();
    },
    closeProjectAddPopup() {
      this.showProjectAddPopup = false;
    },
    async logout() {
      this.$router.push('/');
    },
    goToMyProjectAdd() {
      this.router.push("/pj-add");
    },

onImageUploaded(response) {
      this.logoPreviewUrl = response.info.secure_url;
    },

    async toggleFollow(project) {
  // const project = this.projects[index];
  const walletAddress = await window.ethereum.request({ method: "eth_accounts" });
  const userResponse = await axios.get(`https://cardene7.pythonanywhere.com/api/users/${walletAddress[0]}`);
  const currentUser = userResponse.data;

  if (project.following) {
    // Unfollow the project
    const follwerIndex = project.follwer.data.indexOf(currentUser.pk);
    project.follwer.data.splice(follwerIndex, 1);
  } else {
    // Follow the project
    if (project.follwer) {
      project.follwer.data.push(currentUser.pk);
    } else {
      project.follwer = { data: [currentUser.pk] };
    }
  }

  project.following = !project.following;
  this.updateProject(project);
},

async updateProject(project) {
  try {
    // Clone the project object and remove the 'logo' property
    const updatedProject = { ...project };
    delete updatedProject.logo;

    const response = await axios.put(`https://cardene7.pythonanywhere.com/api/projects/${project.pk}/`, updatedProject);
    console.log('Project updated successfully:', response);
  } catch (error) {
    console.error('Error updating project:', error);
  }
},



    redirectToGasFee() {
      window.location.href = "https://portal.astar.network/astar/assets";
    },
    async fetchProjects() {
  try {
    const response = await axios.get("https://cardene7.pythonanywhere.com/api/projects/");
    const walletAddress = await window.ethereum.request({ method: "eth_accounts" });
    const userResponse = await axios.get(`https://cardene7.pythonanywhere.com/api/users/${walletAddress[0]}`);
    const currentUser = userResponse.data;
    this.projects = response.data.map(project => {
      project.following = project.follwer && project.follwer.data.includes(currentUser.pk);
      return project;
    });
  } catch (error) {
    console.error("Error fetching project:", error);
  }
},


    previewLogo(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreviewUrl = e.target.result;
        this.logoData = file;
      };
      reader.readAsDataURL(file);
    },
    previewDescriptionImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.descriptionImagePreviewUrl = e.target.result;
        this.descriptionImageData = file;
      };
      reader.readAsDataURL(file);
    },
    async submitProject() {
      try {
        const walletAddress = await window.ethereum.request({ method: "eth_accounts" });
        const userResponse = await axios.get(`https://cardene7.pythonanywhere.com/api/users/${walletAddress[0]}`);
        const currentUser = userResponse.data;
        
        const formData = new FormData();
    formData.append("logo", this.logoData);
    formData.append("title", this.projectName);
    formData.append("description", this.projectDescription);
    formData.append("description_img", this.descriptionImageData);
    // formData.append("purpose", this.projectPurpose);
    formData.append("deadline", this.projectDeadline);
    formData.append("vote_deadline", this.projectVoteDeadline);
    formData.append("phase", this.projectPhase);
    formData.append("invalid", false);
    formData.append("users", currentUser.pk);

    await axios.post('https://cardene7.pythonanywhere.com/api/projects/', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    this.projectName = '';
    this.projectDescription = '';
    // this.projectPurpose = '';
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
  position: relative;
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border:2px solid rgba(0, 0, 0, 0.7)
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
  margin-top: 20px;
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
    max-height: 90%;
    overflow-y: auto;
  }

  .popup-inner {
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

.logo-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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

.description-img-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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

.phase {
  position: absolute;
  top: -15px;
  right: -15px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #f8f9fa;
}

.phase-color-1 {
  background-color: #EED8EE;
}

.phase-color-2 {
  background-color: #E3B8FF;
}

.phase-color-3 {
  background-color: #C38FFF;
}

.phase-color-4 {
  background-color: #A363FF;
}

.phase-container {
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  align-items: center;
}

.current-date {
  font-size: 12px;
  color: #888;
  display: flex;
  margin-bottom: 70px;
}

/* DAO PASS section styles */
.dao-pass {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 80px;
  background-color: #f5f5f5;
  border-radius: 10px;
}

/* Rectangular block styles */
.dao-pass-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}

/* Additional blocks styles */
.additional-blocks {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

/* Individual additional block styles */
.additional-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  width: 100%;
  max-width: 180px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}

/* Titles */
h2, h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
</style>
