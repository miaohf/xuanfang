import request from '@/utils/request'

export function fetchContracts(query) {
  return request({
    url: '/contracts',
    method: 'get',
    params: query
  })
}

export function fetchContract(id) {
  return request({
    url: `/contracts/${id}`,
    method: 'get'
  })
}

export function createContract(data) {
  return request({
    url: '/contracts',
    method: 'post',
    data
  })
}

export function updateContract(id, data) {
  return request({
    url: `/contracts/${id}`,
    method: 'put',
    data
  })
}

export function deleteContract(id) {
  return request({
    url: `/contracts/${id}`,
    method: 'delete'
  })
}


export function createContracts(data) {
  return request({
    url: `/contracts/scan`,
    method: 'post',
    data
  })
}