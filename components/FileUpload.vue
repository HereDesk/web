<template>
  <el-upload
    class="file-upload"
    style="display:inline; padding-left:0;"
    name="files" 
    :action="url"
    list-type="picture-card"
    :with-credentials=true 
    :limit="3" 
    :on-success="ImageSuccess" 
    :on-remove="handleRemove" 
    :beforeUpload="FileBeforeAvatarUpload" 
    :file-list="fileList">
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
export default {
  data () {
    return {
      fileList: [],
      annex: [],
      filetype: 'other'
    }
  },
  watch: {
    annex:{
      handler: function(old,oldVal) {
        this.$emit('annex',this.annex)
      },
      deep: true
    }
  },
  computed: {
    url () {
      return "/api/support/upload?type=" + this.filetype
    }
  },
  methods: {
    handleRemove(file,fileList) {
      let data = this.annex
      let beDeleted = file.response["name"]
      for (var i = 0 ;i < data.length;i++) {
        if (data[i] == beDeleted) {
          data.splice(i, 1)
        }
      }
    },
    ImageSuccess(response, fileList) {
      this.annex.push(response["name"])
    },
    FileBeforeAvatarUpload(file) {
      const allow_file_format_list = ["jpg","png","jpeg","gif","bmp",
      	"docx","docx","xls","xlsx","ppt","pptx","pdf","txt","log","md","html","json",
      	"mp4","mp3","mov"]
      const tmp = file.name.split(".")
      const FileSuffix = String(tmp[tmp.length-1]).toLocaleLowerCase()
      const isLt20M = file.size / 1024 / 1024 < 20
      const isFile = allow_file_format_list.includes(FileSuffix)
      if (!isFile) {
        this.$notify.error({
          title: "上传失败",
          message: "不允许上传" + FileSuffix + "格式的文件"
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