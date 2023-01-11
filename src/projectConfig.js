export default {
  name: 'vitedemo', // 项目名称
  projectName: 'vitedemo', // 项目代号
  port: 9000, // 本地运行的端口
  framework: 'vue', // 使用前端框架:vue||uni
  projectType: {
    wechat: false,
    browser: true,
    app: false
  }, // 项目要运行的环境
  vision: '0.01Bate', // 项目版本
  updateTime: '20230103', // 版本升级时间
  // webDeveloper: '127.0.0.1', // 前端开发本地路径
  // webDeveloper: '10.10.20.123', 	// Vincent
  webDeveloper: '10.10.20.101', 	// Reimen
  // webDeveloper: '10.10.20.41',
  // webDeveloper: 'localhost'
  mode: 'test' // dev 开发环境、test 测试环境、produce 正式环境、demo 演示环境
}
