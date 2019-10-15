import { isPlainObject } from './utils'

function defaultTransformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  } else {
    return data
  }
}

function defaultTransformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}

export {
  defaultTransformRequest,
  defaultTransformResponse
}
