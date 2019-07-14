import { getUserFromCookie,getUserFromLocalStorage } from '~/assets/js/auth'
import { Base64 } from 'js-base64'

export default function ({isHMR,context,req,redirect,route,store,next}) {

  if (isHMR) return
  if (process.server && !req) return

  // 获取token
  let token = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()

  // 未登录 (token无效过期)
  if ( !token || typeof(token) === "undefined" ) {
    let fullpath = req.url
    if (fullpath !== '/' && !fullpath.includes('target') ) {
      return redirect("/?target=" + Base64.encodeURI(fullpath))
    } else {
      return redirect(fullpath)
    }
  }

  // 已登录（token有效）
  if (token) {
    let PageData = store.state.PageData
    let identity = store.state.userInfo.identity
    let visted_path = process.server ? route.path : ''
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
