import request from '@/utils/request'

// 权益等级列表
export function gradeList() {
  return request.get('/interest/grade')
}

// 添加/修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/interest/grade'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}
