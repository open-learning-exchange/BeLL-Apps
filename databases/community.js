var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    /*getCommunityByCode: {
        map: function(doc) {
            if (doc && (doc.Code || doc.code))
                emit(doc._id, doc);
        }
    }*/
    getCommunityByCode: {
        map: function(doc) {
            if (doc && doc.Code)
                emit(doc.Code, doc);
        }
    }
}

module.exports = ddoc;