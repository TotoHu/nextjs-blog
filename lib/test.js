var fs = require('fs')
var path = require('path') 

const brunchFilename = path.join(process.cwd(), 'brunch.json')
function updateBrunchState(jsonStr){
    if(typeof(jsonStr) == "object" && jsonStr.length){
        jsonStr = JSON.stringify(jsonStr);
        console.log(jsonStr);
    }
    fs.writeFileSync(brunchFilename, jsonStr);
}
function getBrunchState(){
    /* if(! fs.existsSync(brunchFilename)){
    console.log('############################');
        fs.writeFileSync(brunchFilename, '');
    } */
    const fileContents = fs.readFileSync(brunchFilename, 'utf8');
    let content = '';
    try{
        content = JSON.parse(fileContents);
        console.log(content);
    }catch(e){
        console.log(e);
    }
    return content;
}

updateBrunchState([{"id": 1, "brunchid": 1, "memberids": ",1"},{"id": 2, "brunchid": 2, "memberids": ",2,3"}])