import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    // Enable minification for production
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', 'recharts'],
  },
  environments: {
    client: {
      build: {
        rollupOptions: {
          output: {
            // Manual chunk splitting for better caching (client only)
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-router': ['@tanstack/react-router'],
              'vendor-charts': ['recharts'],
            },
          },
        },
      },
    },
  },
})

export default config
