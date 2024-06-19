import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@Applications': path.resolve(__dirname, 'src/Applications'),
      '@Domain': path.resolve(__dirname, 'src/Domain'),
      '@Infra': path.resolve(__dirname, 'src/Infra'),
      '@Tests': path.resolve(__dirname, 'src/Tests'),
      '@Ioc': path.resolve(__dirname, 'src/IoC'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.spec.ts'],
  },
});
