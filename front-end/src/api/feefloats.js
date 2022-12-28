import request from '@/utils/request'

export function fetchFeefloats(query) {
  return request({
    url: '/feefloats',
    method: 'get',
    params: query
  })
}
