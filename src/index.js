// var app = require('app');  // 控制应用生命周期的模块。
// var BrowserWindow = require('browser-window');  // 创建原生浏览器窗口的模块
const { app, BrowserWindow } = require('electron');
const path = require('path');
// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;
//加载热加载组件
try {
	require('electron-reloader')(module, {});
} catch (_) {
    console.log()
}

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function () {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
      app.quit();
    }
  });


  app.on('ready', function () {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1000, 
        resizable : false,
        // 在渲染进程中使用 node 模块 更改webPreference 
        webPreferences: { 
                          nodeIntegration: true ,
                          contextIsolation:false
                        },
        // icon : path.join(__dirname,'')
       });
  
    // 加载应用的 index.html , node的vue页面服务器
    mainWindow.loadURL('E:/_todo/dip_expe/yedip/src/main.html')
    mainWindow.loadURL('')
    // mainWindow.loadURL('http://43.143.182.88:3002/?token=dbcad706-e788-4159-9ace-7d8a8e1b03dc')
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  
    // 打开开发工具
    // mainWindow.openDevTools();
  
    // 当 window 被关闭，这个事件会被发出
    mainWindow.on('closed', function () {
      // 取消引用 window 对象，如果你的应用支持多窗口的话，
      // 通常会把多个 window 对象存放在一个数组里面，
      // 但这次不是。
      mainWindow = null;
    });
  });
