import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      rootDir: './src',
      outDir: './dist',
      declaration: true,
      declarationDir: './dist'
    }
  },
  clean: true,
  target: 'es2018',
  external: ['react', 'react-dom', '@tanstack/react-table'],
}); 