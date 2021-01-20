var fs = require('fs');
var path = require('path')

var args = process.argv.splice(2)

if(args.length==0){
    console.error('无效参数')
    return false
}
var srcPath = path.resolve('./src');

function titleCase(str) {
    newStr = str.slice(0,1).toUpperCase() +str.slice(1).toLowerCase();
    return newStr;
}

var controller = `import { Request,Response } from 'express'
import ${titleCase(args[0])}Model  from '../models/${args[0]}.model'
import formateData from '../utils/formateData';

const get${titleCase(args[0])} = async (req:Request,resp:Response) => {
    
}

const set${titleCase(args[0])} = async (req:Request,resp:Response) => {
    
}
const delete${titleCase(args[0])} = async (req:Request,resp:Response) => {
    
}
const update${titleCase(args[0])} = async (req:Request,resp:Response) => {
    
}

export default {
    get${titleCase(args[0])},
    set${titleCase(args[0])},
    delete${titleCase(args[0])},
    update${titleCase(args[0])}
}
`


fs.writeFile( `${srcPath}/controller/${args[0]}.controller.ts`, controller, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("controller is create");
});

var models = `import query from '../database'

const ${titleCase(args[0])}Model = {

}

export default  ${titleCase(args[0])}Model;`

fs.writeFile( `${srcPath}/models/${args[0]}.model.ts`, models, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("model is create");
});

var router = `import { Router } from 'express';
import ${titleCase(args[0])}Controller from '../controller/${args[0]}.controller';

const router:Router = Router();

router.post('/get${titleCase(args[0])}',${titleCase(args[0])}Controller.get${titleCase(args[0])});
router.post('/set${titleCase(args[0])}',${titleCase(args[0])}Controller.set${titleCase(args[0])});
router.post('/delete${titleCase(args[0])}',${titleCase(args[0])}Controller.delete${titleCase(args[0])});
router.post('/update${titleCase(args[0])}',${titleCase(args[0])}Controller.update${titleCase(args[0])});

export default router;`



fs.writeFile( `${srcPath}/routes/${args[0]}.router.ts`, router, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("route is create");
});