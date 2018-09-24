const pkg = require('./package')

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
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: [{
        src: '/static/jquery/jquery-3.2.1.min.js'
      },
      {
        src: '/static/bootstrap/js/bootstrap.min.js'
      }
    ]
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
    '~static/static/bootstrap/css/bootstrap.min.css',
    '~static/static/animate/animate.css',
    '~static/static/common/css/public.css',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '~plugins/public.js',
      ssr: true
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
  axios: {
    proxy: true
  },
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8000/api',
      pathRewrite: {
        '^/api/': ''
      }
    },
    '/media/': {
      target: 'http://127.0.0.1:8000/',
      pathRewrite: {
        '^/': ''
      }
    }
  },

  router: {
    middleware: 'auth'
  },
  cache: true,

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}