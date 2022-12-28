import request from '@/utils/request'

export function fetchLabel(id) {
  return request({
    url: `/labels/${id}`,
    method: 'get'
  })
}

export function fetchLabels(query) {
  return request({
    url: '/labels',
    method: 'get',
    params: query
  })
}

export function deleteLabel(id) {
  return request({
    url: `/labels/${id}`,
    method: 'delete'
  })
}

export function fetchLabelsList() {
  return request({
    url: '/labelslist',
    method: 'get'
  })
}

export function updateLabel(id, data) {
  return request({
    url: `/labels/${id}`,
    method: 'put',
    data
  })
}

export function fetchLabelsCount() {
  return request({
    url: '/labels/count',
    method: 'get'
  })
}

// for slice labels
export function updateLabels(data) {
  return request({
    url: `/labels`,
    method: 'put',
    data
  })
}


export function resetLabels() {
  return request({
    url: `/labels/reset`,
    method: 'put'
  })
}

export function fetchLabelStatistics() {
  return request({
    url: `/labels/statistics`,
    method: 'get'
  })
}