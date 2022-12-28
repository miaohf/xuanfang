import request from '@/utils/request'

export function fetchBoxesList(query) {
  return request({
    url: '/boxeslist',
    method: 'get',
    params: query
  })
}


export function fetchBoxesListByPost(data) {
  return request({
    url: '/boxeslist',
    method: 'post',
    data
  })
}


export function fetchBoxesListByPost2(data) {
  return request({
    url: '/boxeslist2',
    method: 'post',
    data
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
