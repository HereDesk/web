<template>
  <el-upload
    style="display:inline;"
    name="images" 
    action="/api/support/upload?type=bug" 
    list-type="picture-card" 
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
      annex: []
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
      const isLt20M = file.size / 1024 / 1024 < 20
      const isJPG = String(file.name.split(".")[1]).toLowerCase() === "jpg"
      const isPNG = String(file.name.split(".")[1]).toLowerCase() === "png"
      const isJPEG = String(file.name.split(".")[1]).toLowerCase() === "jpeg"
      const isGIF = String(file.name.split(".")[1]).toLowerCase() === "gif"
      const isBMP = String(file.name.split(".")[1]).toLowerCase() === "bmp"
      const isTXT = String(file.name.split(".")[1]).toLowerCase() === "txt"
      const isMP4 = String(file.name.split(".")[1]).toLowerCase() === "mp4"
      const isMOV = String(file.name.split(".")[1]).toLowerCase() === "mov"
      if (!isJPG && !isPNG && !isJPEG && !isGIF && !isBMP && !isMP4 && !isTXT && !isMOV) {
        this.$notify.error({
          title: "上传失败",
          message: "上传图片格式只能为jpg/png/jpeg/gif; 文件格式只能是txt; 视频格式只能是mp4或mov"
        })
      }
      if (!isLt20M) {
        this.$notify.error({
          title: "上传失败",
          message: "附件大小不能大于20M"
        })
      }
      return isLt20M && (isJPG || isPNG || isJPEG || isGIF || isBMP || isTXT || isMP4 || isMOV)
    }
  }
}
</script>
