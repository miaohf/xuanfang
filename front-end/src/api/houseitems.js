import request from '@/utils/request'

export function fetchHouseitems(query) {
  return request({
    url: '/houseitems',
    method: 'get',
    params: query
  })
}

export function fetchHouseitem(id) {
  return request({
    url: `/houseitems/${id}`,
    method: 'get'
  })
}

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
