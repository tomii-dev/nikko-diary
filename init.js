const fs = require('fs')

function initData(){
    if(fs.existsSync('./data/json/data.json')){
        return fs.readFileSync('./data/json/data.json')
    }else{
        fs.mkdirSync('./data/json', {recursive:true})
        fs.mkdirSync('./data/entries', {recursive:true})
        fs.writeFileSync('./data/json/data.json', "{}")
        return fs.readFileSync('./data/json/data.json')
    }
}

module.exports.initData = initData