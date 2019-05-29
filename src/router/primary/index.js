
const getMineRouter = (loadLazy) => {
  return [
    {
      path: '/',
      name: 'index',
      component: loadLazy('primary/index'),
      meta: {
        title: 'index'
      }
    }
  ]
}
export { getMineRouter }
