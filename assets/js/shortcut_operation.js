export default {

  key() {
    let platform = navigator.platform

    if (platform.includes('Win')) {
      window.addEventListener("keypress", event => {
        console.log(event, '----')
        if (event.key === 'f' && event.ctrlKey && event.shiftKey()) {
          document.getElementById("id-title-search").focus()
        }
        if (event.key === 'n' && event.ctrlKey) {
          document.getElementById("bug-create").focus()
        }
      })
    } else {
      window.addEventListener("keypress", event => {
        if (event.key === 'f' && event.ctrlKey) {
          document.getElementById("id-title-search").focus()
        }
        if (event.key === 'n' && event.ctrlKey) {
          document.getElementById("bug-create").focus()
        }
      })
    }

  }
}
