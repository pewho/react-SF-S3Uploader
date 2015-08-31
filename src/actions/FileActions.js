var AppDispatcher = require('../dispatcher/AppDispatcher');
var StoreConstants = require('../config/StoreConstants');

var FileActions = {
  refresh: function() {
    AppDispatcher.dispatch({
      actionType: StoreConstants.REFRESH
    });
  },

  upload: function(file) {
    AppDispatcher.dispatch({
      actionType: StoreConstants.UPLOAD,
      file: file
    });
  },

  getUrl: function(file) {
    AppDispatcher.dispatch({
      actionType: StoreConstants.GET_URL,
      file: file
    });
  }
}

module.exports = FileActions;