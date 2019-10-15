interface CustomHeader {
  'Content-Type'?: string;
  [headerName: string]: any;
}

interface Params {
  [paramName: string]: any;
}

export default class Ajax {
  private baseUrl: string
  private customHeader: CustomHeader

  constructor({
    baseUrl = '',
    customHeader = {}
  } = {}) {
    this.baseUrl = baseUrl
    this.customHeader = customHeader
  }

  /**
   * get 请求
   * @param url
   * @param params
   */
  get(url: string, params: Params): Promise<Response> {
    let reqStr = '?'
    Object.keys(params).forEach(key => {
      reqStr += `${key}=${params[key]}&`
    })
    reqStr = reqStr.slice(0, -1)
    return fetch(`${this.baseUrl}${url}${reqStr}`, {
      method: 'GET',
      mode: 'cors',
      headers: Object.assign({}, this.customHeader)
    }).then(response => response.json())
  }

  /**
   * post 请求
   * @param url
   * @param params
   */
  post(url: string, params: Params): Promise<Response> {
    return fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      mode: 'cors',
      headers: Object.assign({
        'Content-Type': 'application/json'
      }, this.customHeader),
      body: JSON.stringify(params)
    }).then(response => response.json())
  }
}
