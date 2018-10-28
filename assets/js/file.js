import axios from 'axios'

export default {
  AnnexDelete(source,file_path,req_data,page_data) {
    let url = ''
    let msg = ''
    if (source == 'bug') {
      url = '/api/qa/bug/annex/delete'
    } else if (source == 'testcase') {
      url = '/api/qa/testcase/annex_delete'
    } else {
      return
    }
    axios({
      method: 'post',
      url: url,
      data: req_data
    }).then(res => {
      if (res.data['status'] === 20000) {
        for (let i in page_data) {
          if (file_path == page_data[i]['url'] || file_path == page_data[i]['file_path']) {
            let index = page_data.indexOf(page_data[i])
            if (index > -1) { 
              page_data.splice(index, 1); 
            }
          }
        }
      }
      return res.data['msg']
    })
  }
}