import fs from 'fs'
import path from 'path'

const brunchFilename = path.join(process.cwd(), 'lib', 'brunch.json')


export function updateBrunchState(jsonStr){
    if(typeof(jsonStr) == "object" && jsonStr.length){
        jsonStr = JSON.stringify(jsonStr);
        console.log(jsonStr);
    }
}

export function getBrunchState(){
    /* if(! fs.existsSync(brunchFilename)){
    console.log('############################');
        fs.writeFileSync(brunchFilename, '');
    } */
    const fileContents = fs.readFileSync(brunchFilename, 'utf8');
    let content = '';
    try{
        content = JSON.parse(fileContents);
    }catch(e){
        console.log(e);
    }
    return content;
}
