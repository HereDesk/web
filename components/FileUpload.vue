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
      const isLt10M = file.size / 1024 / 1024 < 10
      const PicFormat = file.name.split(".")[1] === "jpg"
      const PicFormat1 = file.name.split(".")[1] === "png"
      const PicFormat2 = file.name.split(".")[1] === "jpeg"
      const PicFormat3 = file.name.split(".")[1] === "gif"
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!PicFormat && !PicFormat1 && !PicFormat2 && !PicFormat3) {
        this.$notify.error({
          title: "上传失败",
          message: "上传图片格式只能为jpg/png/jpeg/gif"
        })
      }
      if (!isLt10M) {
        this.$notify.error({
          title: "上传失败",
          message: "上传图片不能大于10M"
        })
      }
      return isLt10M && (PicFormat || PicFormat1 || PicFormat2 || PicFormat3)
    }
  }
}
</script>
