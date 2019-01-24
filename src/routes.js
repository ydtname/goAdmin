import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserMgmt from './views/nav1/UserMgmt.vue'
import HomeMgmt from './views/nav1/HomeMgmt.vue'
import CategoryMgmt from './views/nav1/CategoryMgmt.vue'
import CityMgmt from './views/nav1/CityMgmt.vue'


let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '导航',
    iconCls: 'el-icon-message',//图标样式class
    children: [
      {path: '/main', component: Main, name: '主页', hidden: true},
      {path: '/userMgmt', component: UserMgmt, name: '用户管理'},
      {path: '/homeMgmt', component: HomeMgmt, name: '首页配置'},
      {path: '/categoryMgmt', component: CategoryMgmt, name: '分类管理'},
      {path: '/cityMgmt', component: CityMgmt, name: '城市信息管理'},
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
];

export default routes;