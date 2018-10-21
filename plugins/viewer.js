import Vue from 'vue'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.min.css'

Vue.use(Viewer,{
  defaultOptions: {
    toolbar:{
      // zoomIn:3,
      zoomOut:3,
      flipVertical: 0,
      rotateLeft: 4,
    }
  }
})