<template>
  <el-upload
    class="file-upload"
    style="display:inline; padding-left:0;"
    name="files"
    :action="url"
    ref="upload"
    list-type="picture-card"
    :with-credentials=true
    :on-success="ImageSuccess"
    :on-remove="handleRemove"
    :beforeUpload="FileBeforeAvatarUpload"
    :on-error="FileUploadError"
    :file-list="fileList"
    :limit="fileLimit"
    :on-exceed="handleExceed"
    multiple>
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
  export default {
    props: {
      fileLimit: {
        type: Number,
        default: 5
      },
      pageType: {
        type: String,
        required: true,
        validator: function (value) {
          return ['add', 'edit'].indexOf(value) !== -1
        }
      },
      editFileList: {}
    },

    data () {
      return {
        fileList: [],
        annex: []
      }
    },

    watch: {
      editFileList: {
        handler: function(old,oldval) {
          if (JSON.stringify(this.editFileList) === '{}') {
            this.fileList = []
            return
          }
          if (this.pageType === 'edit') {
            for (const f of this.editFileList) {
              this.fileList.push({"name":f.url,"url":f.url,"response":{"name":f.url}})
            }
          }
          if (this.pageType === 'add') {
            for (const f of this.editFileList) {
              this.fileList.push({"name":f,"url":f,"response":{"name":f}})
            }
          }
        },
        deep: true
      },
      annex:{
        handler: function(old,oldVal) {
          this.$emit('annex',this.annex)
        },
        deep: true
      }
    },

    computed: {
      url () {
        let request_url = "/api/support/upload"
        let url = this.$route.fullPath
        let filetype
        if (url.includes('bug')) {
          filetype = 'bug'
        } else if (url.includes('testcase')) {
          filetype = 'testcase'
        } else {
          filetype = 'other'
        }
        if (this.$route.query.bug_id) {
          return request_url + "?type=" + filetype + "&bug_id=" + this.$route.query.bug_id
        }else if (this.$route.query.case_id) {
          return request_url + "?type=" + filetype + "&case_id=" + this.$route.query.case_id
        } else {
          return request_url + "?type=" + filetype
        }
      }
    },

    methods: {

      /**
       * From Page remove file
       */
      handleRemove(file,fileList) {
        const source = this.$route.fullPath
        let api_url = ""
        let req_data = {"url":file.url}
        if (source.includes('bug')) {
          api_url = '/api/qa/bug/annex/delete'
        } else if (source.includes('testcase')) {
          api_url = '/api/qa/testcase/annex/delete'
        } else {
          return
        }
        this.axios({
          method: 'post',
          url: api_url,
          data: req_data
        }).then(res => {
          if (res.data['status'] === 20000) {
            let data = this.annex
            let beDeleted = file.response["name"]
            for (var i = 0 ;i < data.length;i++) {
              if (data[i] == beDeleted) {
                data.splice(i, 1)
              }
            }
          }
        })
      },

      /**
       * File Upload fail, Clear Local data
       */
      ResErrorRemove(file,fileList) {
        let beDeleted = file["name"]
        for (var i = 0 ;i < fileList.length;i++) {
          if (fileList[i]["name"] == beDeleted) {
            fileList = fileList.splice(i, 1)
          }
        }
      },

      /*
      * File Upload Limit
      */
      handleExceed(file,fileList) {
        this.$notify.error({
          title: "上传失败",
          message: "最多只能上传" + this.fileLimit + "个文件"
        })
      },


      /*
      * File Upload success
      */
      ImageSuccess(response, file,fileList) {
        if (response.status === 20000) {
          // refresh page data
          this.$emit("refresh")
          // alter local data
          this.annex.push(response["name"])
        } else {
          this.ResErrorRemove(file,fileList)
          this.$notify.error({
            title: "上传失败",
            message: response.msg
          })
        }
      },

      /*
      * File Upload Fail
      */
      FileUploadError(error, file, fileList) {
        this.$notify.error({
          title: "上传失败",
          "message":error
        })
      },

      /*
      * File Before Upload, check
      */
      FileBeforeAvatarUpload(file) {
        // check: file size and file format
        const video = ["mp4","mp3","mov","m4v","wmv","ts","3gp","avi","flv","mkv","mpeg"]
        const zip = ["zip","rar","tar","7z","bz2","gz"]
        const doc = ["docx","docx","xls","xlsx","ppt","pptx","pdf",
          "txt","log","md","html","json","ini","yaml"]
        const img = ["jpg","png","jpeg","gif","bmp","svg","psd","tif","tga","ai"]
        const allow_file_format_list = [...video,...zip,...doc,...img]

        let tmp = file.name.split(".")
        let FileSuffix = String(tmp[tmp.length-1]).toLocaleLowerCase()
        let isLt20M = file.size / 1024 / 1024 < 20
        let isFile = allow_file_format_list.includes(FileSuffix)

        if (!isFile) {
          this.$notify.error({
            title: "上传失败",
            message: "不允许上传" + FileSuffix + "格式的文件; 若要上传, 请压缩后在上传！"
          })
        }

        if (!isLt20M) {
          this.$notify.error({
            title: "上传失败",
            message: "附件大小不能大于20M"
          })
        }
        return isLt20M && isFile
      }
    }
  }
</script>
