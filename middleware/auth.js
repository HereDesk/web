import {
  getUserFromCookie,
  getUserFromLocalStorage
} from '~/assets/js/auth'

export default function ({
  context,
  req,
  redirect,
  route,
  store
}) {
  if (process.server && !req) {
    return
  }

  const token = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()
  if (!token) {
    return redirect('/')
    // if (route.fullPath !== "/") {
    //   const url = "/?source=" + route.fullPath
    //   return redirect(url)
    // } else {
    //   return redirect('/')
    // }
  }
  const visted_path = process.server ? route.path : ''
  if (token) {
    const PageData = store.state.PageData
    const identity = store.state.userInfo.identity
    if (visted_path == '/' || visted_path == 1) {
      return redirect('/app/dashboard')
    } else {
      if (identity !== 0 && PageData) {
        for (let v of PageData) {
          if (v.url == route.path & v.is_allow == -1) {
            return redirect('/app/page_auth')
          }
        }
      }
    }
  }
}