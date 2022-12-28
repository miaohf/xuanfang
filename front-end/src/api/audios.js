import request from '@/utils/request'

export function fetchAudios(data) {
  return request({
    url: '/audios',
    method: 'post',
    data: data
  })
}

export function fetchAudio() {
  return request({
    url: `/audios`,
    method: 'get'
  })
}

export function updateAudio(id, data) {
  return request({
    url: `/audios/${id}`,
    method: 'put',
    data
  })
}
