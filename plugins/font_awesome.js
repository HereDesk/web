import Vue from 'vue'

// 仅引入用到的图标以减小打包体积
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.component('v-icon', Icon)