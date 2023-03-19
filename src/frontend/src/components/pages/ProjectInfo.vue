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
          <font-awesome-icon :icon="item.icon" class="mr-2" /> <!-- Font Awesomeアイコンを使用 -->
          {{ item.label }}
        </li>
      </ul>
      <div class="logout" @click="logout">
        <font-awesome-icon icon="sign-out-alt" class="mr-1" /> <!-- Font Awesomeアイコンを使用 -->
        Log Out
      </div>
    </div>
    <div class="main">
      <!-- ウェルカムの文字を移動 -->
      <div class="welcome-and-search">
        <h1 v-if="selectedItem === 0">Welcome Guest</h1>
        <!-- 検索欄を追加 -->
        <div class="search-bar">
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <!-- 戻るボタンを設置 -->
      <div class="back-button" v-if="selectedItem !== 0" @click="selectMenuItem(0)">
        <font-awesome-icon icon="arrow-left" class="mr-1" /> <!-- Font Awesomeアイコンを使用 -->
        Back
      </div>
  <!-- 選択されたメニューに応じてコンテンツを表示 -->
  <div v-if="selectedItem === 1" class="project-detail">
    <div class="project-info">
      <div class="project-icon">
        <img src="project-icon.png" alt="Project Icon" />
      </div>
      <div class="project-details">
        <h2>Project Name</h2>
        <p>Members: 10</p>
        <button class="follow-btn">Follow</button>
      </div>
    </div>
    <div class="project-overview">
      <h3>Project Overview</h3>
      <p>詳細な説明</p>
    </div>
    <div class="proposal-section">
      <div class="proposal-header">
        <h3>Proposal List</h3>
        <button class="create-proposal-btn" @click="showProposalAddPopup = true">Create Proposal</button>
      </div>
      <!-- 提案一覧を表示 -->
      <div class="proposal-list">
        <!-- ここに提案のブロック形式で表示 -->
      </div>
    </div>
  </div>

  <!-- Proposal追加モーダル -->
  <div v-if="showProposalAddPopup" class="popup-overlay" @click.self="showProposalAddPopup = false"></div>
  <div v-if="showProposalAddPopup" class="popup">
    <h2 class="popup-title">Proposal Add</h2>
    <label for="proposal-image" class="proposal-image-label">Image</label>
    <input id="proposal-image" type="file" ref="proposalImageInput" @change="previewProposalImage" style="display: none" />
    <div class="proposal-image-preview" @click="$refs.proposalImageInput.click()">
      <img v-if="proposalImagePreviewUrl" :src="proposalImagePreviewUrl" />
      <div v-else>Click to upload image</div>

      </div>
<label for="proposal-title" class="proposal-title-label">Title</label>
<input id="proposal-title" type="text" v-model="proposalTitle" placeholder="Enter proposal title" />

<label for="proposal-description" class="proposal-description-label">Description</label>
<textarea id="proposal-description" v-model="proposalDescription" placeholder="Enter proposal description"></textarea>

<div class="popup-actions">
  <button class="cancel-btn" @click="showProposalAddPopup = false">Cancel</button>
  <button class="submit-btn" @click="addProposal">Submit</button>
</div>
</div>
</div>
</div>
</template>
<script>
import { ref } from 'vue';

export default {
setup() {
const menuItems = [
  { label: 'Home', icon: 'home' },
  { label: 'Projects', icon: 'project-diagram' },
  { label: 'Messages', icon: 'envelope' },
  { label: 'Settings', icon: 'cog' },
];

const selectedItem = ref(0);
const showProposalAddPopup = ref(false);
const proposalTitle = ref('');
const proposalDescription = ref('');
const proposalImagePreviewUrl = ref(null);

function selectMenuItem(index) {
  selectedItem.value = index;
}

function logout() {
  // ログアウト処理を実装
}

function previewProposalImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      proposalImagePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function addProposal() {
  // 提案の追加処理を実装
  // モーダルを閉じる
  showProposalAddPopup.value = false;
}

return {
  menuItems,
  selectedItem,
  selectMenuItem,
  logout,
  showProposalAddPopup,
  proposalTitle,
  proposalDescription,
  proposalImagePreviewUrl,
  previewProposalImage,
  addProposal,
};
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

h1 {
  font-size: 2rem;
}

/* 検索欄のスタイルを追加 */
.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #999;
}

.project-list {
  margin-top: 20px;
}

.project-list ul {
  list-style-type: none;
  padding: 0;
}

.project-list li {
  margin-bottom: 10px;
}

.add-btn {
  background-color: #28a745;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
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
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  width: 100%;
}

.submit-btn:hover {
  background-color: #218838;
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
  }
}
</style>