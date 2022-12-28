import request from '@/utils/request'

export function fetchCustomers(query) {
  return request({
    url: '/customers',
    method: 'get',
    params: query
  })
}

export function fetchCustomer(id) {
  return request({
    url: `/customers/${id}`,
    method: 'get'
  })
}


export function fetchCustomerByCode(customer_code) {
  return request({
    url: `/customers/code/${customer_code}`,
    method: 'get'
  })
}

export function fetchCustomerChoices(id, data) {
  return request({
    url: `/customers/${id}/choices`,
    method: 'post',
    data
  })
}


export function createCustomer(data) {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
}

export function updateCustomer(id, data) {
  return request({
    url: `/customers/${id}`,
    method: 'put',
    data
  })
}

export function deleteCustomer(id) {
  return request({
    url: `/customers/${id}`,
    method: 'delete'
  })
}


export function fetchCustomersList() {
  return request({
    url: '/customerslist',
    method: 'get'
  })
}

export function fetchCustomersCount() {
  return request({
    url: '/customers/count',
    method: 'get'
  })
}


export function callNumber(data) {
  return request({
    url: '/customers/callnumber',
    method: 'post',
    data
  })
}

export function callNumberbyControl(data) {
  return request({
    url: '/customers/callnumberbycontrol',
    method: 'post',
    data
  })
}
