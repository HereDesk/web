import Vue from 'vue'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// optionally configure hljs
hljs.configure({
  languages: ['javascript', 'css', 'scss','less', 'html',
    'python','java','c','c++','php','perl',
    'shell','bash','powershell',
    'json','sql','markdown',
    'nginx']
})
Vue.use(mavonEditor)
