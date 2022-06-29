module.exports = {
  pages: {
    'index': {
      entry: './src/pages/index/main.js',
      template: 'public/index.html',
      title: 'ToDo',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },

    'new': {
      entry: './src/pages/new/main.js',
      template: 'public/index.html',
      title: 'New task',
      chunks: ['chunk-vendors', 'chunk-common', 'new']
    },

    'login': {
      entry: './src/pages/login/main.js',
      template: 'public/index.html',
      title: 'Login',
      chunks: ['chunk-vendors', 'chunk-common', 'login']
    },

    'register': {
      entry: './src/pages/register/main.js',
      template: 'public/index.html',
      title: 'register',
      chunks: ['chunk-vendors', 'chunk-common', 'register']
    }
  }
}
