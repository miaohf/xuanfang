import request from '@/utils/request'

export function fetchLogs(query) {
  return request({
    url: '/logs',
    method: 'get',
    params: query
  })
}

export function createLog(data) {
  return request({
    url: '/logs',
    method: 'post',
    data
  })
}

export function deleteLog(data) {
  return request({
    url: '/logs',
    method: 'delete',
    data
  })
}