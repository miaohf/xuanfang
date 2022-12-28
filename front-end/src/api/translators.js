import request from '@/utils/request'

export function fetchTranslators(query) {
  return request({
    url: '/translators',
    method: 'get',
    params: query
  })
}

export function fetchTranslator(id) {
  return request({
    url: `/translators/${id}`,
    method: 'get'
  })
}

export function createTranslator(data) {
  return request({
    url: '/translators',
    method: 'post',
    data
  })
}

export function updateTranslator(data) {
  return request({
    url: `/translators`,
    method: 'put',
    data
  })
}

export function deleteTranslator(data) {
  return request({
    url: `/translators/delete`,
    method: 'put',
    data
  })
}
