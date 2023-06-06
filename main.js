// main.js
// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
// COM口监听
const serialport = require("./electron/serialport/index")
serialport()

// 菜单项
const _menu = require("./electron/menu/menu")
const menu = Menu.buildFromTemplate(_menu)
Menu.setApplicationMenu(menu)

// 创建公共对象
let sharedObject = { powerBy: 'reimen', windowIds: [] }
ipcMain.handle('setGlobal', async (event, key, value) => sharedObject[key] = value)
ipcMain.handle('getGlobal', async (event, key) => event.sender.send('getGlobal', key ? sharedObject[key] : sharedObject))

// 窗口项
const path = require('path')
const createWindow = async (loadFile, width = 800, height = 600, openDevTools = false) => {
  // Create the browser window.
  const _win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  // 加载 index.html
  _win.loadFile(loadFile)
  // 打开开发工具
  if (openDevTools) _win.webContents.openDevTools()
  sharedObject.windowIds.push(_win.webContents.id)
  return _win
}
ipcMain.handle('createWindow', async (event, ...args) => {
  let _win = await createWindow(args)
  event.sender.send('createWindow', _win.webContents.id)
})

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。

app.on('ready', async () => {
  await createWindow('./dist/index.html', 1900, 600, true)

  // 创建公共对象
  // 在渲染进程中改变全局变量的值，只能通过ipcRenderer和ipcMain消息机制来处理
  global.sharedObject = sharedObject
  // 在page1页面的js
  // const { ipcRenderer, remote } = require('electron');
  // 获取page2页面的 id
  // let { win2WebContentsId } = remote.getGlobal("sharedObject");
  // 根据页面 id 发送事件
  // ipcRenderer.sendTo(win2WebContentsId, "page1Event", 1, 2, 3);
  // page2页面
  // const { ipcRenderer } = require('electron');
  // ipcRenderer.on("page1Event", (e, a, b, c) => {
  //   alert("我是page2, 监听到 page1Event", a, b, c);
  // })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
