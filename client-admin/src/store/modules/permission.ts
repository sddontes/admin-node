import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes, noRedirectRoutes } from '@/router'
import store from '@/store'

export const filterAsyncRoutes = (routes: RouteConfig[], roleRoutes: any) => {
  const res = []
  for (const route of routes) {
    const tmp = { ...route }
    for (const rr of roleRoutes) {
      if (tmp.path === rr.path) {
        tmp.meta.title = rr.name
        tmp.meta.icon = rr.icon
        tmp.meta.url = rr.url
        tmp.meta.sort = rr.seq
        tmp.meta.operableList = rr.operableList
        tmp.meta.children = rr.children
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, rr.children)
        }
        res.push(tmp)
      }
    }
  }
  return res.sort((a, b) => b.meta.sort - a.meta.sort)
}

export const createAsyncRoutes = (roleRoutes: any, parentPath = '') => {
  const res = []
  for (const rr of roleRoutes) {
    const tmp: any = {
      path: rr.path,
      meta: {
        title: rr.name,
        icon: rr.icon,
        sort: rr.seq,
        url: rr.url,
        operableList: rr.operableList,
        children: rr.children
      }
    }
    if (rr.parentId === 0) {
      tmp.component = () => import('@/layout/index.vue')
      tmp.redirect = rr.path + '/' + rr.children[0].path
    } else {
      // import动态拼接路径无法找到模块，改用require
      tmp.component = (resolve: any) => parentPath.indexOf('/iframe') > -1 ? require(['@/views/iframe/index.vue'], resolve) : require([`@/views${parentPath + '/' + rr.path}/index.vue`], resolve)
    }
    if (rr.children && rr.children.length > 0) {
      tmp.children = createAsyncRoutes(rr.children, parentPath ? parentPath + '/' + rr.path : rr.path)
    }
    res.push(tmp)
  }

  return res.sort((a, b) => b.meta.sort - a.meta.sort)
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public async GenerateRoutes(routes: any[]) {
    // 前后端路由匹配生成路由表
    // const accessedRoutes = filterAsyncRoutes(asyncRoutes, routes)
    // 后端路由直接生成路由表
    const accessedRoutes = createAsyncRoutes(routes)
    this.SET_ROUTES(accessedRoutes.concat(noRedirectRoutes))
  }
}

export const PermissionModule = getModule(Permission)
