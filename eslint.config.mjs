import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier/flat'
export default tseslint.config(
  { ignores: ['.next/**', 'node_modules/**', 'dist/**', 'src/app/**', 'src/routeTree.gen.ts', 'next-env.d.ts', 'next.config.ts'] },
  ...tseslint.configs.recommended,
  prettier,
  { files: ['**/*.{ts,tsx}'], plugins: { 'react-hooks': reactHooks }, rules: {
    ...reactHooks.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  } },
)
