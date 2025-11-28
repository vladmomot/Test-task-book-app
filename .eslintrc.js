module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react-hooks/exhaustive-deps': 'warn', // Предупреждения вместо ошибок
    'react-native/no-inline-styles': 'off', // Разрешить inline стили
  },
};
