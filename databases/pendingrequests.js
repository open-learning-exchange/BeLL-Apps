var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    getAllCommunities:{
        map: function(doc){
            if (doc && doc.kind=='Community') {
                emit(doc.name, doc);
            }
        }
    },
    getDocById:{
        map: function(doc){
            if (doc._id && doc.kind=='Community') {
                emit(doc._id, doc);
            }
        }
    }
}

module.exports = ddoc;