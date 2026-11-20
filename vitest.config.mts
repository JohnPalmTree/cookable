import { defineConfig } from 'vitest/config'

// Pin the timezone so date tests behave the same on both your machines and in CI (which runs in UTC).
process.env.TZ = 'America/New_York'

export default defineConfig({
  // Vite reads the @/ alias straight from tsconfig.json; no plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/domain/**'],
    },
  },
})
