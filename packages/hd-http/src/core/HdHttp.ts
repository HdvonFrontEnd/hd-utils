import axios, { AxiosStatic } from 'axios'
interface HttpStatic extends AxiosStatic{
  Axios: any;
}
const { Axios } = axios as HttpStatic
const { CancelToken, isCancel } = axios

// TODO 在这里可以对Axios自定义，例如重写post方法
// 如果这里使用HdHttp继承Axios，在new HdHttp(config)时会出现ts仍为不应该有参数的错误
// class HdHttp extends Axios {}

export default Axios

export {
  CancelToken,
  isCancel
}
