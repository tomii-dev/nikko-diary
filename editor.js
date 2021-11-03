let $ = jQuery = require('jquery')
const { ipcRenderer } = require('electron')
const fs = require('fs')

const moment = require('moment')

// json data
let jsonDataRaw = fs.readFileSync('data/json/data.json')
let data = JSON.parse(jsonDataRaw)

let entryName = ""
let saveName = ""
let isNew = 0
let createDate = ""

function initValues(name, save, newBool, create){
    console.log("values init")
    console.log(save)
    entryName = name
    saveName = save
    isNew = newBool
    createDate = create

    initPage()

    if(isNew == 0) loadEntry(saveName)
}

function changeName(){
    entryName = $('#nameInput').val()
    $('#nameModal').hide()
    $('#entryTitle').text(entryName)
}

function loadEntry(save){
    console.log(save)
    fs.readFile(`data/entries/${save}.txt`, function(err, read){
        if(err) console.log(err)
        console.log(read)
        $('#text-area').val(read)
    })
}

function initPage(){
    var titleBar = $(`<nav class="navbar navbar-expand-lg navbar-light bg-secondary"></nav>`)
    var fileTitle = $(`<a id="entryTitle" class="navbar-brand">${entryName}</a>`)
    var navBar = $(`<div class="collapse navbar-collapse" id="navbarSupportedContent"></div>`)

    var saveCloseBtnForm = $(`<form class="form-inline my-2 my-lg-0"></form>`)
    var saveBtn = $(`<a type="button" class="btn btn-success" onclick="$('#nameModal').show()">change name</a>`)
    var closeBtn = $(`<a type="button" class="btn btn-danger" onclick="closeEditor()">save and close</a>`)

    titleBar.append(fileTitle)
    titleBar.append(navBar)
    navBar.append(saveCloseBtnForm)
    saveCloseBtnForm.append(saveBtn)
    saveCloseBtnForm.append(closeBtn)

    titleBar.insertBefore($('editor'))
}

function closeEditor(){
    if(entryName == "unnamed entry") 
        entryName = `${moment().format('D')}/${moment().format('M')}/${moment().format('YY')}`
    if($('#text-area').val() != ""){
        var sample = `${$('#text-area').val().substr(0, 25)}...`
        var dataArr = [entryName, saveName, sample, createDate]
        ipcRenderer.send('save_content', $('#text-area').val())
        ipcRenderer.send('save_data', dataArr)
    }
    ipcRenderer.send('close_editor', null)
}

