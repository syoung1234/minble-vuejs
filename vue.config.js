
const path = require("path");

module.exports = {
    devServer: {
      port: 3000,
      proxy: {
        '/api': { 
          target: process.env.VUE_APP_API_URL,
          changeOrigin: true,
        }, 
      },
    },

    outputDir: path.resolve(__dirname,  "./dist"),
    // outputDir: path.resolve(__dirname, '../src/main/resources/static/dist')
}
