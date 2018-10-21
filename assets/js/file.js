import axios from 'axios'

export default {
  FileHandleRemove(file,data) {
    let beDeleted = file.response["name"]
    for (var i = 0 ;i < data.length;i++) {
      if (data[i] == beDeleted) {
        data.splice(i, 1)
      }
    }
  },
  FileBeforeAvatarUpload(file) {
    const isLt10M = file.size / 1024 / 1024 < 10
    const PicFormat = file.name.split(".")[1].toLowerCase() === "jpg"
    const PicFormat1 = file.name.split(".")[1].toLowerCase() === "png"
    const PicFormat2 = file.name.split(".")[1].toLowerCase() === "jpeg"
    const PicFormat3 = file.name.split(".")[1].toLowerCase() === "gif"
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!PicFormat && !PicFormat1 && !PicFormat2 && !PicFormat3) {
      this.$notify.error({
        title: "上传失败",
        message: "上传图片格式只能为jpg/png/jpeg/gif"
      })
    }
    if (!isLt10M) {
      this.$notify.error({
        title: "上传失败",
        message: "上传文件大小不能超过10M"
      })
    }
    return PicFormat || PicFormat1 || PicFormat2 || (PicFormat3 && isLt10M)
  },
  AnnexDelete(source,file_path,req_data,page_data) {
    let url = ''
    if (source == 'bug') {
      url = '/api/qa/bug/annex/delete'
    } else if (source == 'testcase') {
      url = '/api/qa/testcase/annex/delete'
    } else {
      return
    }
    axios({
      method: 'post',
      url: url,
      data: req_data
    }).then(res => {
      if (res.data['status'] === 20000) {
        let tmp = new Array()
        tmp = page_data
        for (var i in tmp) {
          if (file_path == tmp[i]['url']) {
            let index = tmp.indexOf(tmp[i])
            if (index > -1) { 
              tmp.splice(index, 1); 
            }
          }
        }
        this.$notify.success({
          title: '成功',
          message: res.data['msg']
        })
      } else {
        this.$notify.error({
          title: '失败',
          message: res.data['msg']
        })
      }
    })
  },
}