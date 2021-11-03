let $ = jQuery = require('jquery')
const fs = require('fs')
const path = require('path')

const { ipcRenderer } = require('electron')

let jsonDataRaw = fs.readFileSync("data/json/data.json")
let data = JSON.parse(jsonDataRaw)

document.body.onload = loadEntries

function deleteFile(save){
    ipcRenderer.send("remove_entry", save)
}

function loadEntries(){

    for(var entry in data){

        var lastEntry = entry

        var card = $(`<div id='${entry}' class='card border-dark bg-secondary float-child' style='width: 18rem;'></div>`)
        var cardBody = $("<div class='card-body'></div>")
        var cardTitle = $(`<h5 class='card-title'>${data[entry]["title"]}</h5>`)
        var info = $(`<p class='card-text info'>created: ${data[entry]["created"]}<br>last edited: ${data[entry]["last edited"]}</p>`)
        var cardText = $(`<p class='card-text'>${data[entry]["sample"]}</p>`)
        var editBtn = $("<button class='btn btn-dark'>edit</a>")
        var delBtn = $("<button class='btn btn-danger'>delete</a>")

        card.append(cardBody)
        cardBody.append(cardTitle)
        cardBody.append(cardText)
        cardBody.append(info)
        cardBody.append(editBtn)
        cardBody.append(delBtn)

        card.appendTo("#entries")
    }

    var addBtn = $("<button id='add-btn' type='button' class='btn btn-primary btn-xl float-child add-btn border-dark' onclick='openEditorNew()'>new entry +</button>")
    addBtn.appendTo(`#entries`)

    $('#entries').children().each(function(){
        if($(this).hasClass('card')){
            $(this).hide()
            $(this).slideDown("slow")
        }
    })
}

function openEditor(save){
    var title = data[save]["title"]
    console.log(title)
    var dataArr = [save, title]
    ipcRenderer.send('edit', dataArr)
}

function openEditorNew(){
    ipcRenderer.send('edit_new', null)
}

$(document).ready(function(){
    $('button').click(function(e){
        if($(this).text() == "delete"){
            deleteFile($(this).parent().parent().attr("id"))
            ipcRenderer.send('reload_menu', null)
        }
        if($(this).text() == 'edit'){
            openEditor($(this).parent().parent().attr("id"))
        }
    })
})