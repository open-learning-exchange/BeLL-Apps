var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    getCommunityByCode: {
        map: function(doc) {
            if (doc && doc.kind == 'Community')
                emit(doc.code, doc);
        }
    },
    getCommunityByName: {
        map: function(doc) {
            if (doc && doc.kind == 'Community')
                emit(doc.name, doc);
        }
    },
    getCommunityByNationUrl:{
        map: function(doc){
            if (doc.nationUrl && doc.kind=='Community') {
                emit(doc.nationUrl, doc);
            }
        }
    }
}

module.exports = ddoc;