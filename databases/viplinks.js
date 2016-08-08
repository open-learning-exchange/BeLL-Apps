var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    getByMemberName: {
        map: function(doc) {
            if (doc && doc.name) {
                emit(doc.name, doc)
            }
        }
    }
}

module.exports = ddoc;