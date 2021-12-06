export default async ({ app }) => {
  let { localePath } = app
  app.router.afterEach((to, from) => {
    app.store.commit('updateBreadcrumbs', { to, from, localePath })
  });
}
