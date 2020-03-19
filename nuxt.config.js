const pkg = require('./package')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'universal',

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  generate: {
    dir: 'client'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport',content: 'width=device-width, initial-scale=1' },
      { hid: 'description',name: 'description',content: pkg.description }
    ],
    link: [
      { rel: 'icon',type: 'image/x-icon',href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/static/bootstrap/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: '/static/animate/animate.css' }
    ],
    script: []
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#FFFFFF'
  },

  /*
   ** Global CSS
   */
  css: [
    '~assets/css/public.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '@/plugins/public',
      ssr: true
    },
    {
      src: '@/plugins/markdown',
      ssr: false
    },
    {
      src: '@/plugins/viewer',
      ssr: false
    }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],

  /*
   ** Axios module configuration
   */
  // axios: {
  //   proxy: true
  // },
  // proxy: {
  //   '/api/': {
  //     target: 'http://192.168.12.201/api',
  //     pathRewrite: {
  //       '^/api/': ''
  //     }
  //   },
  //   '/media/': {
  //     target: 'http://127.0.0.1:8000/media',
  //     pathRewrite: {
  //       '^/media/': ''
  //     }
  //   }
  // },

  // cache: true,

  router: {
    linkActiveClass: 'active-link',
    middleware: 'auth'
  },


  /*
   ** Build configuration
   */
  build: {
    vender: ['axios', 'marked', 'element-ui', 'echarts', 'lodash'],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
