import request from '@/utils/request'

export function fetchGardensList(query) {
  return request({
    url: '/gardenslist',
    method: 'get',
    params: query
  })
}


export function fetchGardens(query) {
  return request({
    url: '/gardens',
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

