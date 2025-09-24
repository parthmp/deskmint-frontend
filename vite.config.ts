import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),
],
// build: {
//         rollupOptions: {
//             output:{
//                 manualChunks(id) {
//                     if (id.includes('node_modules')) {
//                         return id.toString().split('node_modules/')[1].split('/')[0].toString();
//                     }
//                 }
//             }
//         }
//     }
})
