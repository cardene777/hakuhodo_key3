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
          <div class="project-image">
            <img :src="project.logo" alt="Project logo" />
          </div>
          <div class="project-info">
            <h2>{{ project.title }}</h2>
            <p>{{ project.description }}</p>
            <p>{{ project.members }} members</p>
            <p>Project Deadline: {{ project.deadline }}</p>
            <p>Vote Deadline: {{ project.vote_deadline }}</p>
            <p>Project Phase: {{ project.phase }}</p>
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
    mounted() {
      this.fetchProjectDetails();
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
}
,

  
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
  }
  
  .project-image {
    width: 100%;
    padding-top: 100%;
    position: relative;
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
  
  /* Responsive styles */
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
  }
  </style>