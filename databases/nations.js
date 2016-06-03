var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    getAllNations: {
        map: function(doc) {
            if (doc && doc.type == 'nation') {
                emit(doc.name, doc);
            }
        }
    },
}

module.exports = ddoc;