/* 
  对 axios 的二次封装
*/
import axios from 'axios' // 引入axios
import serverConfig from './serverConfig' // 引入基础配置文件
import qs from 'qs' // 可以对post请求传参进行序列化处理

// 创建一个axios 请求实例
const server = axios.create({
  baseURL: serverConfig.baseURL,   // 基础请求地址
  timeout: 2000,  // 请求超时时间
  withCredentials: false,  // 跨域请求是否需要携带cookie   
})

// 请求拦截器
server.interceptors.request.use(
  (config)=>{
    // 如果开启token认证
    if(serverConfig.useTokenAuthorization){
      // 加入请求头,请求携带token
      config.headers['Authorization'] = localStorage.getItem('token')
    }
    // 设置请求头
    if(!config.headers['content-type']){  // 如果没有设置请求头
      if(config.method === 'post'){
        // post请求
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
        // 序列化，比如表单数据
        config.data = qs.stringify(config.data)
        console.log(config.data);
      } else {
        // 默认类型
        config.headers['content-type'] = 'application/json'
      }
    }
    console.log('请求配置',config);
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 说明一下：
// POST请求参数序列化
// 在POST请求中的 Content-Type 常见的有以下3种形式：

// Content-Type: application/json
// Content-Type: application/x-www-form-urlencoded
// Content-Type: multipart/form-data

// 现在主流基本在用application/json形式，Axios默认以这种形式工作，我们给后端接口传递参数也简单，直接丢在其data参数就行了。
// 但是有时候后端要求Content-Type必须以application/x-www-form-urlencoded形式，那么通过上面传递的参数，后端是收不到的，
// 我们必须对参数数据进行所谓的序列化处理才行，让它以普通表单形式(键值对)发送到后端，而不是json形式

// 响应拦截器
//响应失败时返回的参数处理
const messageMap = {
  302:"接口重定向了！",
  400:"请求参数错误！",
  401: "您未登录，或者登录已经超时，请先登录！",
  403:"您没有权限访问该资源！",
  404:"您访问的资源不存在！",
  500:"服务器内部错误！",
  502:"网关错误！",
  504:"网关超时！",
  default: "异常问题，请联系管理员！"
}

server.interceptors.response.use(
  response => {
    let data = response.data
    // 处理自己的一些业务逻辑，比如加上loading效果，token是否过期等等
    return data
  },
  error => {
    if(error && error.response){
      // 使用key-value的形式
      return messageMap[error.response.status] || "default"
    }

    //服务器连结果都没有返回
    if (!window.navigator.onLine) {
      //断网处理：跳转断网页面/提示网络错误等等
      return;
    }
  }
)

// 因为项目结构问题，这里需要用函数中转一下，不然在被引入的js文件内可直接return new requst({option})
function request(option) {
  return server(option)
}

export default request