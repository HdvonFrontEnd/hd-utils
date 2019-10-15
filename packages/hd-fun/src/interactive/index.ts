import { browser } from '../util'

/**
 * 拷贝指定值
 * @param value
 * @return 是否成功拷贝
 */
function copyData(value: any): boolean {
  try {
    const inputDom = document.createElement('input')
    inputDom.value = value
    document.body.appendChild(inputDom)
    inputDom.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    document.body.removeChild(inputDom) // 删除DOM
    return true
  } catch (e) {
    return false
  }
}

/**
 * 在新窗口打开链接，用于绕开浏览器对window.open的限制
 * @param url
 * @param targetType
 */
function openWindow(url: string, targetType = '_blank'): void {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', targetType)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 下载blob数据
 * @param blob
 * @param filename
 */

function downloadBlobFile(blob: Blob, filename: string): void {
  if (browser('ie')) {
    // ie
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename)
    } else {
      window.open(URL.createObjectURL(blob))
    }
  } else {
    // google
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
    link.onload = (): void => {
      document.body.removeChild(link)
    }
  }
}

export {
  copyData,
  openWindow,
  downloadBlobFile
}
