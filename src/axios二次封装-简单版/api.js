// 该文件是接口调用示例：

import request from ".";  // 引入index.js文件

// get请求，携带query参数
export const getTest = (params) => {
  return request({
    url: '/test',
    method: 'GET',
    params
  })
}

// post请求，携带请求体参数
export const postTest = (data) => {
  return request({
    url: '/test1',
    method: 'POST',
    data
  })
}