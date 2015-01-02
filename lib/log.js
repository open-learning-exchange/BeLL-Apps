var moment = require('moment')
module.exports = function(process, message) {
  console.log(moment().format('YYYY-MM-DD HH:MM:SS') + ' - ' + process + ' - ' + message)
}
