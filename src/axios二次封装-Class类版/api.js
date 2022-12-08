/* 导入封装的axios文件 */
import request from "./request";  // 引入request.js文件

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