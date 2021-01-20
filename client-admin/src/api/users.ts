import request from '@/utils/request'

export const getUsers = (data: any) =>
  request({
    url: '/users/getUsers',
    method: 'post',
    data
  })

export const setUser = (data: any) =>
  request({
    url: '/users/setUser',
    method: 'post',
    data
  })

export const updateUser = (data: any) =>
  request({
    url: '/users/updateUser',
    method: 'post',
    data
  })

export const deleteUser = (data: any) =>
  request({
    url: '/users/deleteUser',
    method: 'post',
    data
  })

export const resetPassword = (data: any) =>
  request({
    url: '/users/resetPassword',
    method: 'post',
    data
  })

export const getUserInfo = () =>
  request({
    url: '/getUserInfor',
    method: 'post'
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const login = (data: any) =>
  request({
    headers: {
      noMsg: true
    },
    url: '/user/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })

export const getCompany = (data: any) =>
  request({
    url: '/users/getCompany',
    method: 'post',
    data
  })
  export const wangpu = () =>
  request({
    url: 'http://admin.jia.com/wangpu/crazy-thursday/edit/10060',
    method: 'get'
  })