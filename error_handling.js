let error_resp = {
    status : 'error',
    msg : 'An error has been encountered'
  };
  
  let handler = (error) => {
  
    // Update error message
    error_resp.msg = error;
    return error_resp;
    
  }
  
  module.exports = handler;