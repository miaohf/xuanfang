import request from '@/utils/request'

export function fetchTexts(data) {
  return request({
    url: '/texts',
    method: 'post',
    data: data
  })
}

export function fetchText() {
  return request({
    url: `/texts`,
    method: 'get'
  })
}