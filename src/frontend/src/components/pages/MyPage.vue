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
      <!-- 検索欄を追加 -->
      <div class="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <!-- 選択されたメニューに応じてコンテンツを表示 -->
      <h1 v-if="selectedItem === 0">Welcome Guest</h1>
      <div v-if="selectedItem === 1" class="project-list">
        <h2>Project List</h2>
        <!-- プロジェクト一覧を表示 (モックデータ) -->
        <ul>
          <li v-for="(project, index) in projects" :key="index">
            {{ project }}
          </li>
        </ul>
      </div>
      <button
    v-if="selectedItem === 0"
    class="add-btn"
    @click="showProjectAddPopup = true"
  >
        <font-awesome-icon icon="plus" class="mr-1" />
        MY Project Add
      </button>
      <div
        v-if="showProjectAddPopup"
        class="popup-overlay"
        @click.self="showProjectAddPopup = false"
      ></div>
      <div v-if="showProjectAddPopup" class="popup">
        <h2 class="popup-title">PJ Add</h2>
        <label for="logo" class="logo-label">Logo Image</label>
        <input
          id="logo"
          type="file"
          ref="logoInput"
          @change="previewLogo"
          style="display: none"
        />
        <div class="logo-preview" @click="$refs.logoInput.click()">
          <img v-if="logoPreviewUrl" :src="logoPreviewUrl" />
          <div v-else>Click to upload logo</div>
        </div>
        <label for="name">PJ Name</label>
        <input id="name" type="text" v-model="projectName" />
        <label for="description">Description</label>
        <textarea id="description" v-model="projectDescription"></textarea>
        <label for="members">Members</label>
        <input id="members" type="text" v-model="projectMembers" />
        <button class="submit-btn" @click="submitProject">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router"; // リダイレクトのためにインポート

export default {
  setup() {
    const router = useRouter();
    return {
      router,
      showProjectAddPopup: false,
      logoPreviewUrl: "",
      projectName: "",
      projectDescription: "",
      projectMembers: "",
    };
  },
  data() {
    return {
      selectedItem: 0,
      menuItems: [
        { label: 'MY PROJECT', icon: 'project-diagram' },
        { label: 'PROJECT LIST', icon: 'list' },
        { label: 'DAO PASS', icon: 'passport' },
        { label: 'Medicine Order', icon: 'prescription-bottle' },
        { label: 'Message', icon: 'envelope' },
        { label: 'Settings', icon: 'cog' },
      ],
      projects: ['Project 1', 'Project 2', 'Project 3'], // モックプロジェクトデータ
    };
  },
  methods: {
    selectMenuItem(index) {
      this.selectedItem = index;
    },
    logout() {
      // ログアウト処理をここに追加
    },
    goToMyProjectAdd() {
      this.router.push("/pj-add");
    },
    previewLogo() {
      const file = this.$refs.logoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    submitProject() {
      // ここでプロジェクトを追加する処理を実装
      this.showProjectAddPopup = false;
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
