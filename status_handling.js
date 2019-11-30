let status_resp = {
    status : '',
    msg : ''
  };
  
  let handler = (status,msg) => {
  
    status_resp.status = status;
    status_resp.msg = msg;
    return status_resp;
    
  }
  
  module.exports = handler;