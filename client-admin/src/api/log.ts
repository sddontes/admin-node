import request from '@/utils/request'

export const getOperatelog = (data: any) =>
  request({
    url: '/opreatelog/getOperatelog',
    method: 'post',
    data
  })