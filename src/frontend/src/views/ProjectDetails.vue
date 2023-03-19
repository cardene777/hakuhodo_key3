<template>
    <div class="app">
      <div class="sidebar">
        <ul class="menu">
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            :class="{ active: selectedItem === index }"
            @click="redirectToMyPage"
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
        <div class="project-details" v-if="project">
          <div class="project-block">
            <div class="project-image">
              <img :src="project.logo" alt="Project logo" />
            </div>
            <div class="project-info">
              <h2>{{ project.title }}</h2>
              <p>{{ project.members }} members</p>
              <button class="follow-btn">Follow</button>
            </div>
          </div>
          <div class="project-overview">
            <h3>Project Overview</h3>
            <p>{{ project.description }}</p>
          </div>
          <div class="proposal-section">
            <div class="proposal-header">
              <h4>Proposal List</h4>
              <button class="create-post-btn">Create Post</button>
              </div>
            <div class="proposal-block" v-for="proposal in proposals" :key="proposal.id">
              <h5>{{ proposal.title }}</h5>
              <p>{{ proposal.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        selectedItem: null,
        project: {
          logo: "",
          title: "",
          description: "",
          members: 0,
          deadline: "",
          vote_deadline: "",
          phase: "",
          proposals: []
        },
        menuItems: [
          { label: "MY PROJECT", icon: "project-diagram" },
          { label: "PROJECT LIST", icon: "list" },
          { label: "DAO PASS", icon: "passport" },
          { label: "Medicine Order", icon: "prescription-bottle" },
          { label: "Message", icon: "envelope" },
          { label: "Settings", icon: "cog" },
        ],
      };
    },
    async mounted() {
      this.fetchProjectDetails();
      this.fetchProposals();
    },
    methods: {
      redirectToMyPage() {
        this.$router.push("/my-page");
      },
      async fetchProjectDetails() {
  try {
    const projectTitle = this.$route.params.title;
    console.log('Project title from route params:', projectTitle);
    const response = await axios.get("https://cardene7.pythonanywhere.com/api/projects/");
    const projects = response.data;
    console.log('Projects:', projects);
    this.project = projects.find((project) => project.title === projectTitle);
    console.log('Selected project:', this.project);
  } catch (error) {
    console.error("Error fetching project details:", error);
  }
},
async fetchProposals() {
        try {
          const response = await axios.get("https://cardene7.pythonanywhere.com/api/proposals/");
          this.proposals = response.data;
        } catch (error) {
          console.error("Error fetching proposals:", error);
        }
      },
      logout() {
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

.project-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.project-block {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.project-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 20px;
}

.project-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.follow-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.project-overview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left:330px;
}

.project-overview h3 {
  font-size: 35px;
  margin-bottom: 10px;
  /* margin-left:170px; */
}

.project-overview p {
  margin-left: 20px;
}

.proposal-section {
  width: 100%;
  margin-top: 20px;
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ccc;
  padding-top: 2%;
  padding-bottom: 10px;
}

.proposal-block {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.create-post-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .menu li {
    padding: 10px  }

.logout {
  left: 10px;
}

.main {
  padding: 10px;
}

.project-image img {
  width: 70%;
}

.project-info h2 {
  font-size: 18px;
}

.follow-btn {
  padding: 5px 10px;
}

.project-overview h3 {
  font-size: 20px;
}
}
</style>
