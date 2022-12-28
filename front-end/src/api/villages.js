import request from '@/utils/request'

export function fetchVillagesList(query) {
  return request({
    url: '/villageslist',
    method: 'get',
    params: query
  })
}

// export function fetchBook(id) {
//   return request({
//     url: `/books/${id}`,
//     method: 'get'
//   })
// }

// export function createBook(data) {
//   return request({
//     url: '/books',
//     method: 'post',
//     data
//   })
// }

// export function updateBook(id, data) {
//   return request({
//     url: `/books/${id}`,
//     method: 'put',
//     data
//   })
// }

// export function deleteBook(id) {
//   return request({
//     url: `/books/${id}`,
//     method: 'delete'
//   })
// }

