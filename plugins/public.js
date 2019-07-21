import Vue from 'vue'

// 引入iconfont.cn图标字体
import '~/assets/iconfont/iconfont.css'

// axios
import axios from "axios"
Vue.prototype.axios = axios

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
Vue.use(hljs)

// 引入elementUi
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 自定义组件
import PageLoading from "~/components/PageLoading"
import Pagination from "~/components/Pagination"
import BaseNav from '~/components/BaseNav'
import Modal from "~/components/Modal"
import MessageBox from "~/components/MessageBox"
import ProductInfo from "~/components/ProductInfo"

Vue.component('PageLoading',PageLoading)
Vue.component('Pagination',Pagination)
Vue.component('BaseNav',BaseNav)
Vue.component('Modal',Modal)
Vue.component('MessageBox',MessageBox)
Vue.component('ProductInfo',ProductInfo)
