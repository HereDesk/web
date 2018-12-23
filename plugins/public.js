import Vue from 'vue'

// 引入iconfont.cn图标字体
import '~/assets/iconfont/iconfont.css'
// axios
import axios from "axios"
// 引入elementUi
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import Modal from "~/components/Modal"

Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.component('Modal',Modal)