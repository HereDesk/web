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
    fileLimit: Number,
    identification: String
  },

  data () {
    return {
      fileList: [],
      annex: []
    }
  },

  watch: {
    fileList: {
      handler: function(old,oldVal) {
        console.log(this.fileList)
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
      let url = this.$route.fullPath
      let filetype
      if (url.includes('bug')) {
        filetype = 'bug'
      } else if (url.includes('testcase')) {
        filetype = 'testcase'
      } else {
        filetype = 'other'
      }
      return "/api/support/upload?type=" + filetype
    }
  },

  methods: {

    // file remove
    handleRemove(file,fileList) {
      let data = this.annex
      let beDeleted = file.response["name"]
      for (var i = 0 ;i < data.length;i++) {
        if (data[i] == beDeleted) {
          data.splice(i, 1)
        }
      }
    },

    // 当上传图片，服务器未返回成功时，清除本地filelist
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
        this.annex.push(response["name"])
      } else {
        // this.$refs.upload.clearFiles()
        this.ResErrorRemove(file,fileList)
        this.$notify.error({
          title: "上传失败",
          message: response.msg
        })
      }
    },

    /*
    * File Upload error
    */
    FileUploadError(err, file, fileList) {
      this.$notify.error({title: "上传失败","message":error})
    },

    /*
    * File Before Upload
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