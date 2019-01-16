import Vue from 'vue'

// 引入iconfont.cn图标字体
import '~/assets/iconfont/iconfont.css'

// axios
import axios from "axios"

// 引入elementUi
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

// 自定义组件
import PageLoading from "~/components/PageLoading"
import Pagination from "~/components/Pagination"
import BaseNav from '~/components/BaseNav'
import Modal from "~/components/Modal"
import ProductInfo from "~/components/ProductInfo"


Vue.use(ElementUI)
Vue.prototype.axios = axios

Vue.component('PageLoading',PageLoading)
Vue.component('Pagination',Pagination)
Vue.component('BaseNav',BaseNav)
Vue.component('Modal',Modal)
Vue.component('ProductInfo',ProductInfo)