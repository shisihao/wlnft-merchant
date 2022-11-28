import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/castlogs', {
    params
  })
}
// 审核 `通过`
export function statusPass(data) {
  return request.post('/castlogs/audit', {
    ...data
  })
}

// 审核 `驳回`
export function statusReject(data) {
  return request.post('/castlogs/reject', {
    ...data
  })
}

