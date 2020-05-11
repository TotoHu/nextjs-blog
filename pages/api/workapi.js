import fs from 'fs'
import path from 'path'

const brunchFilename = path.join(process.cwd(), 'pages', 'api', 'brunch.json')


function updateBrunchState(jsonStr){
    if(typeof(jsonStr) == "object" && jsonStr.length){
        jsonStr = JSON.stringify(jsonStr);
    }
    fs.writeFileSync(brunchFilename, jsonStr);
}

function getBrunchState(){
    /* if(! fs.existsSync(brunchFilename)){
        fs.writeFileSync(brunchFilename, '');
    } */
    const fileContents = fs.readFileSync(brunchFilename, 'utf8');
    let content = [];
    try{
        content = JSON.parse(fileContents);
    }catch(e){
    }
    return content;
}



export default (req, res) => {
    const {
        query: {brunchid, memberid, status},
    } = req;
    //console.log('###########################');
    //console.log(brunchid, memberid, status);
    let result = getBrunchState().slice();

    if( (typeof(brunchid) !='undefined'&& /^[0-9]+.?[0-9]*/.test(brunchid)) && 
        (typeof(memberid) !='undefined'&& /^[0-9]+.?[0-9]*/.test(memberid)) && 
        typeof(status) !='undefined'){
        const splitSymbol = ',';
        const STATUS = {
            ON: 'ON',
            OFF: 'OFF'
        };
        if(status == STATUS.ON){//turn on the trigger
            let isChecked = false;
            for(let i in result){
                if(result[i].brunchid == brunchid){
                if((result[i].memberids+splitSymbol).indexOf(splitSymbol+memberid+splitSymbol) == -1){
                    result[i].memberids += splitSymbol+memberid;
                }
                isChecked = true;
                }
            }
            if(!isChecked){
                result.push({
                    "id": (result.length+1).toString(),
                    "brunchid": brunchid, 
                    "memberids": splitSymbol+memberid
                })
            }
        }else if(status == STATUS.OFF){//turn off the trigger
            for(let i in result){
                if(result[i].brunchid == brunchid){
                result[i].memberids = (result[i].memberids+splitSymbol).replace(splitSymbol+memberid+splitSymbol, splitSymbol);
                result[i].memberids = result[i].memberids.slice(0, result[i].memberids.length-1);
                break;
                }
            }
        }
        //console.log('result here:', result);
        res.status(200).json({
            flag: true,
            data: {
                result
            }
        })
        updateBrunchState(result);
    }else{
        const brunches = [
            {id: 1, name: 'Homepages'},
            {id: 2,name: 'MARKETING'},
            {id: 3,name: 'NewTradeShowCenterTemp'},
            {id: 4,name: 'SEO-Temp2'},
            {id: 5,name: 'NEWS'},
            {id: 6,name: 'HELP'},
            {id: 7,name: 'SYP'},
            {id: 8,name: 'tscgi-bin'},
        ];
    
        const members = [
            {id: 1,name: 'Tracy'},
            {id: 2,name: 'Toto'},
            {id: 3,name: 'Fox'},
            {id: 4,name: 'Gavin'},
        ];

        res.status(200).json({
            flag: true,
            data: {
                result,
                brunches,
                members
            }
        })
    }
}