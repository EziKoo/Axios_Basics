/* 
  该文件是通过创建类来对axios的二次封装
*/
import axios from 'axios'
import { ElMessage } from 'element-plus'
import serverConfig from './serverConfig'

// 自己创建一个类
class Http {
  constructor (option) {
    this.option = option || {}
    // 是否拦截
    this.intercept = this.option.intercepte === true
    // 注册axios
    this.init()
    /* 
      注意这里的return返回的是一个引用类型(对象，数组，函数)，所以，当使用 new Http() 创建出来的对象，就是下面retrun返回的对象
    */
    return this.connect()
  }

  // 初始化方法
  init(){
    // 创建axios实例，保存在Http实例身上
    this.serve = axios.create({
      baseURL: serverConfig.baseURL,  // api的base_URL
      timeout: 3000,  // 请求超时时间
      withCredentials: true,  // 允许携带cookie
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 请求拦截
    this.serve.interceptors.request.use(
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

    // 响应拦截
    this.serve.interceptors.response.use(
      response => {
        if (this.intercept) {
          if (response.data.statusCode === 1) {
            return response.data
          } else {
            this.errorHandle(response.data.object || '请求发生错误')
          }
        }
        return response.data
      },
      error => {
        // 如果接口是静默处理错误信息，则直接将错误信息全部返回出去
        if (error.config.errorSilence) {
          return Promise.reject(error)
        }
        if (error.response && error.response.status === 403) {
          // 如果服务端返回1403则认为当前请求资源要求登录，而当前会话未登录，跳至登录页面
          if (error.response.data && error.response.data.statusCode === 1403) {
            // 未登录
            window.location.href =
              BASE_URL.webServer +
              '/admin/loginPage.ac?fw=' +
              encodeURIComponent(window.location.href)
            return
          } else if (
            error.response.data &&
            error.response.data.statusCode === 1401
          ) {
            // 无权限
            window.location.href =
              BASE_URL.webServer + '/admin/error/authenticationFailed.ac'
            return
          } else if (error.response.data && error.response.data.content) {
            // 其他情况弹出错误提示
            this.errorHandle(error.response.data.content)
          }
        } else {
          this.errorHandle(
            error.response && error.response.data && error.response.data.content
              ? error.response.data.content
              : error.message
          )
        }
        return Promise.reject(error)
      }
    )
  }

   // 通用错误回调
   errorHandle (msg) {
    // 非静默请求才提示
    ElMessage({
      message: msg,
      type: 'error',
      duration: 2 * 1000
    })
  }

  // 发送请求获取数据方法
  connect () {
    // 锁定请求
    if (this.lock) return
    this.lock = true
    return this.service(this.option)
  }
}

// 因为项目结构问题，这里需要用函数中转一下，不然在被引入的js文件内可直接return new requst({option})
function request (option) {
  // 返回一个Http实例对象
  return new Http(option)
}

export default request