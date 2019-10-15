export { formatTime } from 'hd-fun'

const getType = (item: any): string => {
  return Object.prototype.toString.call(item).slice(8, -1).toLowerCase()
}

export {
  getType
}
