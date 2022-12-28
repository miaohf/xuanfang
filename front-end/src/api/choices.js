import request from '@/utils/request'

// export function fetchContracts(query) {
//   return request({
//     url: '/contracts',
//     method: 'get',
//     params: query
//   })
// }

// export function fetchContract(id) {
//   return request({
//     url: `/contracts/${id}`,
//     method: 'get'
//   })
// }

export function createChoice(data) {
  return request({
    url: '/choices',
    method: 'post',
    data
  })
}

export function deleteChoice(data) {
  return request({
    url: `/choices`,
    method: 'delete',
    data
  })
}

// export function deleteChoice(id) {
//   return request({
//     url: `/contracts/${id}`,
//     method: 'delete'
//   })
// }
