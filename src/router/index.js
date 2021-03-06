import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
]

const router = new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export default router
export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/userTable'),
        name: 'UserTable',
        meta: { roles: ['admin'], title: 'user', icon: 'peoples', noCache: true, redirect: 'noredirect' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    meta: { title: 'manage', icon: 'component' },
    children: [
      {
        path: 'add',
        hidden: true,
        component: () => import('@/views/product/productAdd'),
        name: 'ProductAdd',
        meta: { roles: ['admin'], title: 'addproduct', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'list',
        component: () => import('@/views/product/listTable'),
        name: 'ProductTable',
        meta: { roles: ['admin'], title: 'products', icon: 'list', noCache: false, redirect: 'noredirect' }
      },
      {
        path: 'catalog',
        component: () => import('@/views/product/catalogTable'),
        name: 'CatalogTable',
        meta: { roles: ['admin'], title: 'catalog', icon: 'tree', noCache: true, redirect: 'noredirect' }
      }
    ]
  },
  {
    path: '/module',
    component: Layout,
    meta: { title: 'module', icon: 'component' },
    alwaysShow: true,
    children: [
      {
        path: 'message/list',
        component: () => import('@/views/message/listTable'),
        name: 'MessageTable',
        meta: { roles: ['admin'], title: 'messages', icon: 'list', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'article/list',
        component: () => import('@/views/article/listTable'),
        name: 'ArticleTable',
        meta: { roles: ['admin'], title: 'articleList', icon: 'list', noCache: true, redirect: 'noredirect' }
      }
    ]
  },
  {
    path: '/cms',
    component: Layout,
    meta: { title: 'cms', icon: 'component' },
    alwaysShow: true,
    children: [
      {
        path: 'banner/add',
        hidden: true,
        component: () => import('@/views/banner/bannerAdd'),
        name: 'BannerAdd',
        meta: { roles: ['admin'], title: 'addbanner', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'banner/list',
        component: () => import('@/views/banner/listTable'),
        name: 'BannerTable',
        meta: { roles: ['admin'], title: 'banners', icon: 'list', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'nav/add',
        hidden: true,
        component: () => import('@/views/nav/navAdd'),
        name: 'NavAdd',
        meta: { roles: ['admin'], title: 'addnav', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'nav/list',
        component: () => import('@/views/nav/listTable'),
        name: 'NavTable',
        meta: { roles: ['admin'], title: 'navs', icon: 'list', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'block/add',
        hidden: true,
        component: () => import('@/views/block/blockAdd'),
        name: 'BlockAdd',
        meta: { roles: ['admin'], title: 'addblock', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'block/list',
        component: () => import('@/views/block/listTable'),
        name: 'BlockTable',
        meta: { roles: ['admin'], title: 'blocks', icon: 'list', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'component/product/add',
        hidden: true,
        component: () => import('@/views/component/product/comProductAdd'),
        name: 'ComProductAdd',
        meta: { roles: ['admin'], title: 'addcomproduct', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'component/product/list',
        component: () => import('@/views/component/product/listTable'),
        name: 'ComProductTable',
        meta: { roles: ['admin'], title: 'componentproduct', icon: 'list', noCache: false, redirect: 'noredirect' }
      },
      {
        path: 'siteinfo/add',
        hidden: true,
        component: () => import('@/views/siteinfo/siteInfoEdit'),
        name: 'SiteInfoEdit',
        meta: { roles: ['admin'], title: 'editSiteInfo', noCache: true, redirect: 'noredirect' }
      },
      {
        path: 'siteinfo/list',
        component: () => import('@/views/siteinfo/listTable'),
        name: 'SiteInfoTable',
        meta: { roles: ['admin'], title: 'siteInfo', icon: 'list', noCache: false, redirect: 'noredirect' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
