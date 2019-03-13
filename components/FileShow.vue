<template>
  <div id="components-annexs" class="container-fluid mb-3">
      <div class="row">
        <div class="col-lg-2 col-md-3 col-sm-4 images mb-3" v-for="(p,index) in Annex" :key="index" v-viewer>
          <div id="file-type-other" class="file-card" 
            v-if="['md','log','txt','json','html'].includes(p.suffix)">
            <a class="file-link pt-2" :href="p.file_path || p.url" target="_blank">
              <i class="iconfont size-2"
                :class="{ 
                  'icon-markdown': p.suffix === 'md',
                  'icon-icon-rizhi font-color-1296db': p.suffix === 'log',
                  'icon-txt font-color-00BFA5': p.suffix === 'txt',
                  'icon-jsonfile': p.suffix === 'json',
                  'icon-html font-color-00BFA5': p.suffix === 'html'}">
                </i>
              <p class="file-float-text">查看文件</p>
            </a>
          </div>
          <div id="file-type-doc" class="file-card" 
            v-else-if="['xls', 'xlsx','ppt','pptx','doc','docx','pdf'].includes(p.suffix)">
            <a class="file-link pt-2" :href="p.file_path || p.url" target="_blank">
              <i class="iconfont size-2 icon-zip"
                :class="{
                  'icon-PDF font-color-d81e06': p.suffix === 'pdf',
                  'icon-WORD font-color-007BFF': ['doc','docx'].includes(p.suffix),
                  'icon-excel font-color-00BFA5': ['xls','xlsx'].includes(p.suffix),
                  'icon-PPT font-color-d81e06': ['ppt','pptx'].includes(p.suffix)}">
              </i>
              <p class="file-float-text">查看文档</p>
            </a>
          </div>
          <div id="file-type-zip" class="file-card" 
            v-else-if="['zip','rar','tar','7z','bz2','gz'].includes(p.suffix)">
            <a class="file-link pt-2" :href="p.file_path || p.url" target="_blank">
              <i class="iconfont size-2 icon-zip"></i>
              <p class="file-float-text">下载压缩包</p>
            </a>
          </div>
          <div id="file-type-video" class="file-card" 
            v-else-if="['mp4','mov','mp3'].includes(p.suffix)">
            <a class="file-link pt-2" :href="p.file_path || p.url" target="_blank">
              <i class="iconfont size-2 icon-video"></i>
              <p class="file-float-text">查看视频</p>
            </a>
          </div>
          <div id="file-type-image" v-else>
            <img class="img-thumbnail" alt="..." :src="p.file_path || p.url">
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    props: {
      Annex: {}
    }
  }
</script>

<style scoped>
  .img-thumbnail {
    height: 8rem !important;
    width: 100% !important;
  }

  .file-card {
    border: 1px dashed rgb(192, 204, 218);
    border-radius: 6px;
    box-sizing: border-box;
    width: 99px;
    height: 99px;
    display: flex;
    text-align: center;
  }

  .file-card .file-float-text {
    font-size: 0.85rem;
    color: #757577;
  }

  .file-link {
    display: block;
    width:100%;
    height:100%;
    color:inherit;
  }
</style>
