import request from '@/utils/request'

export const getRoles = (data: any) =>
  request({
    url: '/role/getRole',
    method: 'post',
    data
  })

export const addRole = (data: any) =>
  request({
    url: '/role/setRole',
    method: 'post',
    data
  })

export const updateRole = (data: any) =>
  request({
    url: '/role/updateRole',
    method: 'post',
    data
  })

export const deleteRole = (data: any) =>
  request({
    url: '/role/deleteRole',
    method: 'post',
    data
  })
export const getRoutes = (data: any) =>
  request({
    url: '/role/getRoutes',
    method: 'post',
    data
  })
export const setRoutes = (data: any) =>
  request({
    url: '/role/setRoutes',
    method: 'post',
    data
  })
