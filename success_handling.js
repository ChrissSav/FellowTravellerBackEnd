let success_resp = {
    status : 'success',
    msg : 'Success status'
  };
  
  let handler = (success) => {
  
    // Update error message
    success_resp.msg = success;
    return success_resp;
    
  }
  
  module.exports = handler;