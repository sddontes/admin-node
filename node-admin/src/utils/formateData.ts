const replaceUnderLine = (resArr:any, char = '_') =>{
    let newVal = '';
    let newArr = resArr.map((obj:any)=>{
      let newObj:any = {}
      Object.keys(obj).map(val=>{
        let arr = val.split('')
        let index = arr.indexOf(char)
        if(index>-1){
          arr.splice(index, 2, arr[index+1].toUpperCase())
          newVal = arr.join('')
          newObj[newVal]=obj[val]
        }else{
          newObj[val]=obj[val]
        }
      })
      return newObj
    })
    return newArr
}

// 下划线转换驼峰
const toHump = (data:string)=> {
    return data.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
const toLine = (data:string)=> {
  return data.replace(/([A-Z])/g,"_$1").toLowerCase();
}

function toTree(data: Array<any>) {
  let result: any = []
  if(!Array.isArray(data)) {
      return result
  }
  data.forEach(item => {
      delete item.children;
  });
  let map:any = {};
  data.forEach(item => {
      map[item.id] = item;
  });
  data.forEach(item => {
      let parent = map[item.parent_id || item.parentId];
      if(parent) {
          (parent.children || (parent.children = [])).push(item);
      } else {
          result.push(item);
      }
  });
  return result;
}

export default {
    replaceUnderLine,
    toHump,
    toLine,
    toTree
};