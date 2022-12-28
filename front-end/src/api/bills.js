
import request from '@/utils/request'

export function fetchBills(query) {
  return request({
    url: '/bills',
    method: 'get',
    params: query
  })
}

export function fetchBill(id) {
  return request({
    url: `/bills/${id}`,
    method: 'get'
  })
}

export function updateBillsByCustomerId(data) {
    return request({
      url: `/bills`,
      method: 'put',
      data
    })
  }