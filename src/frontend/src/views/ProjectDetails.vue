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
      <div class="phase-container">
      <div class="phase" :class="`phase-color-${project.phase}`">{{ project.phase }}</div>
    </div>
    </div>
    <div class="project-overview">
      <img :src="project.description_img" alt="Project description image" /> 
      <h3>Project Overview</h3>
      <p>{{ project.description }}</p>
    </div>
    <div class="proposal-section">
      <div class="proposal-header">
        <h4 class="proposal-list-title">Proposal List</h4>
        <button class="create-post-btn" @click="openCreatePostModal">Create Post</button>
      </div>
      <div class="proposal-block" v-for="proposal in proposals" :key="proposal.id">
      <h5>{{ proposal.title }}</h5>
      <p>{{ proposal.description }}</p>
      <p class="vote-deadline">Vote Deadline: {{ proposal.vote_deadline }}</p>
      <div class="status-button" :class="{ 'active': isActive(proposal.vote_deadline), 'closed': !isActive(proposal.vote_deadline) }">
        {{ isActive(proposal.vote_deadline) ? "Active" : "Closed" }}
      </div>
      <button class="vote-btn" v-if="isActive(proposal.vote_deadline)" @click="openVoteModal(proposal)">Vote</button>
    </div>
  </div>
  </div>
</div>

<div class="modal-overlay" v-if="showVoteModal">
    <div class="modal-content">
      <h4>{{ selectedProposal.title }}</h4>
      <p>{{ selectedProposal.description }}</p>
      <div class="progress">
  <div class="progress-agree" :style="{width: agreePercentage + '%'}"></div>
  <div class="progress-disagree" :style="{width: disagreePercentage + '%'}"></div>
</div>
<p1>Agree: {{ voteCounts.agree }} Disagree: {{ voteCounts.disagree }}</p1>
      <div class="vote-buttons">
        <button
  class="agree-btn"
  :disabled="userHasVoted"
  @click="userHasVoted ? alert('You have already voted on this proposal.') : submitVote(selectedProposal.pk, true)"
>
  Agree
</button>
<button
  class="disagree-btn"
  :disabled="userHasVoted"
  @click="userHasVoted ? alert('You have already voted on this proposal.') : submitVote(selectedProposal.pk, false)"
>
  Disagree
</button>
      </div>
      <button class="close-modal" @click="closeVoteModal">Close</button>
    </div>
  </div>
  </div>
  <div class="modal-overlay" v-if="showCreatePostModal">
    <div class="modal-content">
      <h4>Create a New Post</h4>
      <input type="text" v-model="newPost.title" placeholder="Title" />
      <textarea v-model="newPost.description" placeholder="Description"></textarea>
      <input type="date" v-model="newPost.vote_deadline" />
      <div class="create-post-buttons">
        <button class="submit-btn" @click="submitPost">Submit</button>
        <button class="cancel-btn" @click="closeCreatePostModal">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      userHasVoted: false,
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
      voteCounts: {
        agree: 0,
        disagree: 0,
      },
      newPost: {
        title: "",
        description: "",
        vote_deadline: "",
      },
      showCreatePostModal: false,
      menuItems: [
        { label: "MY PROJECT", icon: "project-diagram" },
        { label: "PROJECT LIST", icon: "list" },
{ label: "Settings", icon: "cog" },
],
showVoteModal: false,
selectedProposal: {},
};
},
async mounted() {
  this.fetchProjectDetails(this.$route.params.pk);
    this.fetchProposals(this.$route.params.pk);
},

computed: {
      currentDate() {
        return new Date().toISOString().slice(0, 10);
      },
      agreePercentage() {
    return (this.voteCounts.agree / (this.voteCounts.agree + this.voteCounts.disagree)) * 100;
  },
  disagreePercentage() {
    return (this.voteCounts.disagree / (this.voteCounts.agree + this.voteCounts.disagree)) * 100;
  },
    },

methods: {

  isActive(deadline) {
        return this.currentDate <= deadline;
      },

redirectToMyPage() {
this.$router.push("/my-page");
},
async fetchProjectDetails(pk) {
      try {
        const response = await axios.get(`https://cardene7.pythonanywhere.com/api/projects/${pk}/`);
        this.project = response.data;
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    },

    openCreatePostModal() {
      this.showCreatePostModal = true;
    },
    closeCreatePostModal() {
      this.showCreatePostModal = false;
    },

    async submitPost() {
    try {
      const walletAddress = await window.ethereum.request({ method: "eth_accounts" });
      const userResponse = await axios.get(`https://cardene7.pythonanywhere.com/api/users/${walletAddress[0]}`);
      const currentUser = userResponse.data;

      if (!currentUser) {
        console.error("Error: Wallet address not found in the list of users.");
        return;
      }

      const postData = {
        users: currentUser.pk,
        projects: parseInt(this.$route.params.pk),
        title: this.newPost.title,
        description: this.newPost.description,
        vote_deadline: this.newPost.vote_deadline,
      };

      await axios.post("https://cardene7.pythonanywhere.com/api/proposals/", postData);
      this.showCreatePostModal = false;
      this.newPost.title = "";
      this.newPost.description = "";
      this.fetchProposals(this.$route.params.pk);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  },

async fetchProposals(pk) {
  try {
    const response = await axios.get(
      `https://cardene7.pythonanywhere.com/api/proposals/`
    );
    this.proposals = response.data.filter(
      (proposal) => proposal.projects === parseInt(pk)
    );
  } catch (error) {
    console.error("Error fetching proposals:", error);
  }
},
logout() {
},

async openVoteModal(proposal) {
  this.selectedProposal = proposal;
      this.showVoteModal = true;
      await this.fetchVoteCounts(proposal.id);
},

closeVoteModal() {
this.showVoteModal = false;
},
async submitVote(proposalId, vote) {
      try {
        const userAddress = await window.ethereum.request({ method: "eth_accounts" });
        const userResponse = await axios.get(
          `https://cardene7.pythonanywhere.com/api/users/${userAddress[0]}`
        );
        const currentUser = userResponse.data;

        if (!currentUser) {
          console.error("Error: Wallet address not found in the list of users.");
          return;
        }

        const postData = {
        users: currentUser.pk,
        proposal: proposalId,
        vote: vote,
      };
      await axios.post("https://cardene7.pythonanywhere.com/api/votes/", postData);
      this.showVoteModal = false;
      await this.fetchVoteCounts(proposalId);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  },
  async fetchVoteCounts(proposalId) {
  try {
    const userAddress = await window.ethereum.request({ method: "eth_accounts" });
    const userResponse = await axios.get(
      `https://cardene7.pythonanywhere.com/api/users/${userAddress[0]}`
    );
    const currentUser = userResponse.data;

    const response = await axios.get(
      `https://cardene7.pythonanywhere.com/api/votes/?proposal=${proposalId}`
    );
    const votes = response.data;

    // Check if the current user has voted
    this.userHasVoted = votes.some(vote => vote.users === currentUser.pk && vote.proposal === this.selectedProposal.pk);

    this.voteCounts.agree = votes.filter((vote) => vote.vote === true && vote.proposal === this.selectedProposal.pk).length;
    this.voteCounts.disagree = votes.filter((vote) => vote.vote === false && vote.proposal === this.selectedProposal.pk).length;
  } catch (error) {
    console.error("Error fetching vote counts:", error);
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
  position: relative;
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
  max-height: 250px; /* 追加：最大高さの設定 */
  object-fit: contain; /* 変更：画像サイズを調整 */
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
  margin-left: 330px;
}

.project-overview h3 {
  font-size: 35px;
  margin-bottom: 10px;
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

.proposal-list-title {
  font-size: 24px;
}

.proposal-block {
  width: 70%;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.create-post-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 35px;
  cursor: pointer;
}

.vote-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
  margin-top: 10px;
}
.vote-modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  margin: auto;
}
.modal-content p1{
  display: flex;
  position: relative;
  left: 150px;
  padding: 10px;
}

.create-post-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.vote-buttons {
display: flex;
justify-content: space-around;
margin-top: 20px;
}

.agree-btn,
.disagree-btn {
background-color: #28a745;
color: white;
border: none;
border-radius: 5px;
padding: 10px 20px;
cursor: pointer;
}

.disagree-btn {
background-color: #dc3545;
}

.close-modal {
background-color: #ccc;
color: white;
border: none;
border-radius: 5px;
padding: 5px 15px;
cursor: pointer;
margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
}

.project-overview img {
  width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: contain;
  border-radius: 5px;
  margin-bottom: 20px;
  position: relative;
  top: 10px;
  right: 150px; /* 値を増やして画像をもう少し左に移動 */
}

.vote-deadline {
    font-size: 12px;
    color: #999;
  }

  .status-button {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    font-size: 12px;
    border-radius: 15px;
  }

  .status-button.active {
    background-color: #28a745;
    color: white;
  }

  .status-button.closed {
    background-color: #ccc;
    color: white;
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
.modal-content input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.modal-content textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: vertical;
}

.progress {
  width: 100%;
  height: 15px;
  background-color: #ccc;
  display: flex;
  border-radius: 5px;
}

.progress-agree {
  background-color: #28a745;
}

.progress-disagree {
  background-color: #dc3545;
}

</style>