
const path = require("path");

module.exports = {
    devServer: {
      port: 3000,
      proxy: {
        '/api': { 
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
        }, 
      },
    },

    outputDir: path.resolve(__dirname, "./dist"),
}