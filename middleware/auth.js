import {
  getUserFromCookie,
  getUserFromLocalStorage
} from '~/assets/js/auth'

export default function ({isHMR,context,req,redirect,route,store}) {

  if (isHMR) return

  if (process.server && !req) {
    return
  }

  const token = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()

  if (!token || typeof(token) == "undefined") {
    return redirect("/")
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
