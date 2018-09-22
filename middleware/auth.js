import {
  getUserFromCookie,
  getUserFromLocalStorage
} from '~/assets/js/auth'

export default function ({
  context,
  req,
  redirect,
  route
}) {
  if (process.server && !req) {
    return
  }
  const token = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()
  if (!token) {
    return redirect('/')
  }
  const visted_path = process.server ? route.path : ''
  if (token) {
    if (visted_path == '/' | visted_path == 1) {
      return redirect('/app/dashboard')
    }
  }
}
