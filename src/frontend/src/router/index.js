import { createRouter, createWebHistory } from 'vue-router';
import Auth from '../components/pages/AuthPage';
import MyPage from '../components/pages/MyPage';
import ProjectInfo from '../components/pages/ProjectInfo';
import ProjectProposal from '../components/pages/ProjectProposal';
import AdminPage from '../components/pages/AdminPage';

const routes = [
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
  },
  {
    path: '/',
    name: 'AuthPage',
    component: Auth,
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: MyPage,
  },
  {
    path: '/pj-info',
    name: 'ProjectInfo',
    component: ProjectInfo,
  },
  {
    path: '/pj-proposal',
    name: 'ProjectProposal',
    component: ProjectProposal,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;