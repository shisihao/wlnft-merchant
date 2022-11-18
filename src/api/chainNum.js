import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/orders', {
    params
  })
}

// 导出订单
export function exportOrder(data) {
  return request.get('/orders/export', {
    data
  })
}
