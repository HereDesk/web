import Vue from 'vue'

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
Vue.use(hljs)

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