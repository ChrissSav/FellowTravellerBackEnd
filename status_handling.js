let status_resp = {
    status : 'error',
    msg : ''
  };
  // 1 true
  let handler = (status,msg) => {
    if(status==1){
        status_resp.status = 'success';
    }
    status_resp.msg = msg;
    return status_resp;
    
  }
  
  module.exports = handler;