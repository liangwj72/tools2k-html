import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'


/**
 * 我们的代理设置
 */
function myProxy() {
  const env=loadEnv('development',"."); // 读取环境变量
  console.log("环境变量:",env)

  // 以下url要转发到后端
  const urls = [
    '/api/', '/upload/', '/_common_/',
  ]

  // 迭代urls，生成代理规则
  const proxy = {}
  for (let i = 0; i < urls.length; i++) {
    const key = urls[i]
    proxy[key] = {
      target: env.VITE_BACKEND_SERVER,
      ws: true,
      changeOrigin: true,
      // secure: import.meta.env.DEV_SERVER_HTTPS === 'true' // 如果是https接口，需要配置为 true
    }
  }
  console.log('当前用的API代理', env, proxy)
  return proxy
}


// https://vitejs.dev/config/
export default ({ mode }) => {

//  console.log("mode=",mode)

  return defineConfig({
    plugins: [vue()],
    base: "./",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: myProxy()
    },
    define: {
      BUILD_TIMESTAMP: new Date().getTime(),
    }
  })
};
