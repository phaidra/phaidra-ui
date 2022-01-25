export default function ({ store, redirect }) {
  if (!store.getters['token']) {
    redirect('/')
  }
}
