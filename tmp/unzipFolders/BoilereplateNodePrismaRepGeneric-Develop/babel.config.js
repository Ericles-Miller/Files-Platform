module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          "@entities": "./src/entities",
          "@controllers": "./src/controllers",
          "@repositories": "./src/repositories",
          '@modules': './src/modules',
          '@shared': './src/shared',
          '@errors': './src/errors',
          '@utils': './src/utils',
          '@config': './src/config'           
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  ignore: [
    '**/*.spec.ts'
  ],
  overrides: [
    // ...
  ]
};