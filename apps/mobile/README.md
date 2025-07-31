note because this is in a monorepo had to remove react, react-dom, and react-native-web deps and change metro.config.js a bit.


React (基础 UI 构建框架)
│
├── React Native (平台桥接层：将 React 渲染为原生组件)
│    └── Expo (RN 打包/热重载/跨平台开发加速器)
│         └── Tamagui (统一样式系统 + 组件库，支持 Web + Native)
│
└── Web React (标准浏览器环境)