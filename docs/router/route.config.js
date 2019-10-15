import NavList from 'src/nav-list.js'

const loadComponent = name => {
  if (name === 'CHANGELOG') {
    return () => import('../pages/changelog/changelog')
  } else if (name === 'README') {
    return () => import('../../README.md')
  } else {
    return () => import(`../docs/${name}.md`)
  }
}

const routerList = NavList.map(item => {
  return {
    path: item.path,
    name: item.name,
    component: loadComponent(item.name)
  }
})

export default routerList
