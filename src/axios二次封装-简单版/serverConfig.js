// 该配置文件作为axios二次封装的基础的配置文件

let baseURL = ''

switch(process.env.NODE_ENV){
  // 可以在根目录的 package.json 配置 NODE_ENV
  case 'production':
    baseURL = '生产环境地址'
    break;
  case 'test':
    baseURL = '测试环境地址'
    break;
  default:
    baseURL = '开发环境地址'
}

const serverConfig = {
  baseURL: 'baseURL',   // 请求基础地址，一般就是默认地址前面重复的片段，可根据环境自定义
  useTokenAuthorization: true,  // 是否开启 token 认证
}

export default serverConfig