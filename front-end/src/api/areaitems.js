import request from '@/utils/request'

export function fetchAreaitems() {
  return request({
    url: '/areaitems',
    method: 'get'
  })
}

