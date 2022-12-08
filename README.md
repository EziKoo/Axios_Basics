## 学习Axios

### axios的基本使用：

  1、axios调用的返回值是Promise实例。

  2、成功的值叫response，失败的值叫error。
  
  3、axios成功的值是一个axios封装的response对象，服务器返回的真正的数据在response.data中，所以有的时候我们在使用axios发请求的时候
      会看到res.data.data.xxx这样的代码，会有疑问为啥有两个data，就是这个原因，因为第一个data是axios原本给我们封装的response对象中的data
      而第二个data是后端接口返回给我们数据中定义的data字段名，所以需要使用 res.data.data.xxx

  4、携带query参数时，编写的配置项叫做params

  5、携带params参数时，就需要自己手动拼在url中

### axios的基本配置：

  1、url,           // 请求地址

  2、method,        // 配置请求方法

  3、timeout,       // 配置超时的时间

  4、headers,       // 配置请求头信息

  5、responseType,  // 配置响应数据的格式(默认值json)

  6、params,        // 配置query参数

  7、data,          // 配置请求体参数

  8、cancelToken    // 配置取消请求的配置

### axios的默认配置：
```javascript
  // 给axios配置默认属性，以后只要是axios发出去的请求，超时时间都是2秒，以后就可以不用在每一个axios配置项中都写下面两个配置
  // 一劳永逸
  axios.defaults.timeout = 2000
  axios.defaults.headers = {school:JUFE}
  // 在每一个发送请求的开始加上下面这段路径
  axios.defaults.baseURL = 'http://localhost:5000'
```

### axios的create()方法：

`axios.create(config)`

  1、根据指定的配置创建一个新的axios，也就是每个新的axios都有自己的配置

  2、新axios只是没有取消请求和批量发送请求的方法，其他所有语法都是一致的

  3、为什么要设计这个语法？

    需求：项目中有部分接口需要的配置与另一部分接口需要的配置不太一样

