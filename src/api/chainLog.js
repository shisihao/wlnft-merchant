import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/chainLog', {
    params
  })
}

// 导出订单
export function exportOrder(data) {
  return request.get('/chainLog/export', {
    data
  })
}
