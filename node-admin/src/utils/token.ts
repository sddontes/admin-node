const jwt = require('jsonwebtoken');
const Token = {
  encrypt:function(data:any,time='15d'){ //data加密数据，time过期时间
    return jwt.sign(data, 'token', {expiresIn:time})
  },
  decrypt:function(token:any){
    try {
      let data = jwt.verify(token, 'token');
      return {
        token:true,
        id:data.id,
        username: data.username,
      };
    } catch (e) {
      return {
        token:false,
        data:e
      }
    }
  }
}
export default Token;