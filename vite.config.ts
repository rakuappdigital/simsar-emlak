import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ölçüm (data/analytics.ts) olaylarına sürüm/build eklenir — tek kaynak Xcode projesi.
function iosVersion(key: string): string {
  try {
    const pbx = readFileSync(new URL('./ios/App/App.xcodeproj/project.pbxproj', import.meta.url), 'utf8')
    return pbx.match(new RegExp(`${key} = ([^;]+);`))?.[1] ?? '?'
  } catch {
    return '?'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(iosVersion('MARKETING_VERSION')),
    __APP_BUILD__: JSON.stringify(iosVersion('CURRENT_PROJECT_VERSION')),
  },
})
