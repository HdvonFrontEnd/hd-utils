/**
 * 注册组件
 * @param component ---- require.context的返回值
 * @return componentObj --- vue的component对象，{ componentName：component }
 */
export const registerComponent = component => {
  const requireAll = context => context.keys().map(context)
  const componentObj = {}
  requireAll(component).forEach(({ default: item }) => {
    componentObj[item.name] = item
  })
  return componentObj
}
