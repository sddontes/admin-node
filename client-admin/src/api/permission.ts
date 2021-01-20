import request from '@/utils/request'

// 获取全站路由资源
export const getMenus = () =>
  request({
    url: '/menu/getMenu',
    method: 'post'
  })

// 获取角色路由资源
export const getRoleMenus = (data: any) =>
  request({
    url: '/menu',
    method: 'post',
    data
  })

// 设置角色路由资源权限
export const setRoleMenus = (data: any) =>
  request({
    url: '/role/setRoutes',
    method: 'post',
    data
  })

export const addMenu = (data: any) =>
  request({
    url: '/menu/setMenu',
    method: 'post',
    data
  })

export const editMenu = (data: any) =>
  request({
    url: '/menu/updateMenu',
    method: 'post',
    data
  })

export const deleteMenu = (data: any) =>
  request({
    url: '/menu/deleteMenu',
    method: 'post',
    data
  })
