module.exports = {
  sendSuccess: function(result) {
    this.body = {
      code: 200,
      errMsg: '',
      data: result
    }
  },
  sendError: function(errorMsg) {
    this.body = {
      code: 300,
      errMsg: errorMsg,
    }
  }
};