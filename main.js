const { app, BrowserWindow, ipcMain, Menu} = require('electron')
const fs = require('fs')
const { toNamespacedPath } = require('path')

const moment = require('moment')
var sound = require('sound-play')

const init = require('./init.js')

const path = require('path')
const { createSecureContext } = require('tls')

require('electron-reload')(__dirname)

// menu
const template  = [
    {
        label: "file",
        submenu: [
            {
                label: "bing chilling",
                click: bingChilling,
            },
        ],
    },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// json data
let data = JSON.parse(init.initData())

var  menuWindow = null
var currentWindow = null

const noop = () => {}

function mainWindow () {
    const main = new BrowserWindow({
        width: 1280,
        height: 720,

        webPreferences:{
            nodeIntegration:  true,
            contextIsolation: false
        }
    })

    main.loadFile('html/menu.html')
    menuWindow = main
}

function saveEntry(content){
    ipcMain.on('save_data', function(event, arg){
        var date = `${moment().format('D')}/${moment().format('M')}/${moment().format('YY')}`
        data[arg[1]] = {}
        data[arg[1]]["title"] = arg[0]
        data[arg[1]]["sample"] = arg[2]
        data[arg[1]]["created"] = arg[3]
        data[arg[1]]["last edited"] = date
        var writeData = JSON.stringify(data)
        fs.writeFile(`./data/entries/${arg[1]}.txt`, content, noop)
        fs.writeFile('./data/json/data.json', writeData, noop)
    })
}

function removeEntry(save){
    delete data[save]
    var writeData = JSON.stringify(data)
    fs.writeFile('./data/json/data.json', writeData, noop)
    fs.unlink(`./data/entries/${save}.txt`, noop)
}

function openEditor (name, save, isNew) {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,

        webPreferences:{
            nodeIntegration:  true,
            contextIsolation: false
        }
    })

    win.loadFile('html/editor.html')
    currentWindow = win

    if(isNew){
        console.log("chungus")
        var createDate = `${moment().format('D')}/${moment().format('M')}/${moment().format('YY')}` 
        save = getNextEntry()
        name = "unnamed entry"
    }else createDate = data[save]["created"]

    win.webContents.once('did-navigate', function(){
        win.webContents.once('dom-ready', function(){
            win.webContents.executeJavaScript(`initValues("${name}", "${save}", "${isNew}", "${createDate}")`)
        })
    })
}

function bingChilling(){
    const win = new BrowserWindow({
        width: 600,
        height: 600
    })
    win.loadFile('html/bing_chilling.html')
    setTimeout(function(){win.close()},1300)
}

function getNextEntry(){
    return `entry${Object.keys(data).length + 1}`
}

// event handlers
ipcMain.on('close_editor', function(event, arg){
    currentWindow.close()
    menuWindow.reload()
})

ipcMain.on('edit', function(event, content){
    openEditor(content[1], content[0], 0)
})

ipcMain.on('edit_new', function(event, arg){
    openEditor(null, null, 1)
})

ipcMain.on('save_content', function(event, content){
    saveEntry(content)
})

ipcMain.on('remove_entry',  function(event, save){
    removeEntry(save)
})

ipcMain.on('reload_menu', function(event, save){
    menuWindow.reload()
})

app.on('ready', mainWindow)