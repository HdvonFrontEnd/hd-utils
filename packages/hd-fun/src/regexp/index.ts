/**
 * 正则表达式集合
 * @type {{}}
 */
import {
  RegexpSet
} from '../types'
const regexp: RegexpSet = {
  // 校验名称
  regexpAccount: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
  // 校验IP
  regexpIP: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
  // 校验端口
  regexpPort: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
  // 校验手机号码
  regexpMobilePhone: /^[1][3-9]\d{9}$/,
  // 校验固定电话号码
  regexpPhone: /^0\d{2,3}-\d{7,8}$/,
  // 校验邮箱
  regexpEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // 校验居民身份证号
  regexpResidentID: /^\d{17}[\dxX]$|^\d{15}$/,
  // 校验整数
  regexpInteger: /^((-?[1-9]\d*)|0)$/,
  // 校验正整数
  regexpIntegerP: /^[1-9]\d*$/,
  // 校验负整数
  regexpIntegerN: /^-[1-9]\d*$/,
  // 只能有英文字母
  regexpEnOnly: /^[A-Za-z]+$/,
  // 只有英文字母或下划线
  regexpEnUnderline: /^[A-Za-z_]+$/,
  // 只有英文或数字
  regexpEnNumber: /^[A-Za-z0-9]+$/,
  // 只有中文字符
  regexpChOnly: /^[\u4e00-\u9fa5]+$/,
  // 含有中文字符
  regexpHasCh: /[\u4e00-\u9fa5]+/,
  // 校验20位国标编码
  regexpGB: /^[0-9]{20}$/,
  // 只允许输入汉字，英文，数字，下划线，短线
  regexpChEnNumDash: /^[\u4e00-\u9fa5A-Za-z0-9_\-]+$/,
  // 校验MAC地址，以xx-xx-xx-xx-xx-xx的形式（xx为16进制数字）
  regexpMac: /^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$/,
  // 校验两位正整数
  regexpTwoDigit: /^(([1-9]\d)|(0[1-9]))$/,
  // 校验经度
  regexpLongitude: /^[+-]?(((1[0-7][0-9]|[1-9]?[0-9])(\.\d{1,6})?)|(180(\.0{1,6})?))$/,
  // 校验维度
  regexpLatitude: /^[+-]?((([1-8]?[0-9])(\.\d{1,6})?)|(90(\.0{1,6})?))$/
}

export default regexp
