import request from '@/utils/request'


export const getCompany = (data: any) =>
  request({
    url: '/company/getCompany',
    method: 'post',
    data
  })
export const setCompany = (data: any) =>
  request({
    url: '/company/setCompany',
    method: 'post',
    data
  })
export const deleteCompany = (data: any) =>
  request({
    url: '/company/deleteCompany',
    method: 'post',
    data
  })
export const updateCompany = (data: any) =>
  request({
    url: '/company/updateCompany',
    method: 'post',
    data
  })