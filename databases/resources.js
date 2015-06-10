var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/bell'
}

ddoc.views = {
  NewsResources: {
    map: function(doc) {
      if (doc.title) {
        emit(doc.Tag, true)
      }
    }
  },
  check_for_optimization: {
    map: function(doc) {
      if ((doc.need_optimization === true) && (doc.openWith == 'PDF.js')) {
        emit(doc._id, doc);
      }
    }
  },
  count: {
    map: function(doc) {
      emit(doc._id, 1);
    },
    reduce: function(keys, values, rereduce) {
      return sum(values);
    }
  },
  listCollection: {
    map: function(doc) {
      if (doc.Tag && doc.kind == 'Resource') {
        if (Array.isArray(doc.Tag)) {
          if (doc.Tag.length > 0) {
            for (var idx in doc.Tag) {
              emit(doc.Tag[idx], doc._id);
            }
          }
        } else {
          emit(doc.Tag, doc._id)
        }
      }
      if (doc.subject && doc.kind == 'Resource') {
        if (Array.isArray(doc.subject)) {
          if (doc.subject.length > 0) {
            for (var idx in doc.subject) {
              emit(doc.subject[idx], doc._id);
            }
          }
        } else {
          emit(doc.subject, doc._id)
        }
      }
      if (doc.Level && doc.kind == 'Resource') {
        if (Array.isArray(doc.Level)) {
          if (doc.Level.length > 0) {
            for (var idx in doc.Level) {
              emit(doc.Level[idx], doc._id);
            }
          }
        } else {
          emit(doc.Level, doc._id)
        }
      }
      if (doc.Medium && doc.kind == 'Resource') {
        emit(doc.Medium, doc._id)
      }
      if (doc.sum && doc.timesRated >= 1 && doc.kind == 'Resource') {
        emit(Math.ceil(doc.sum / doc.timesRated), doc._id)
      }
      if (doc.title) {
        var txt = doc.title;
        var prefix = txt.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
        if (prefix.length > 0) {
          for (var idx in prefix) {
            if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
              emit(prefix[idx], doc._id);
          }
        }
      }
      if (doc.author && doc.kind == 'Resource') {
        if (Array.isArray(doc.author)) {
          auth = doc.author
          for (var idnx in auth) {
            var prefix = auth[idnx].replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
            if (prefix.length > 0) {
              for (var idx in prefix) {
                if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
                  emit(prefix[idx], doc._id);
              }
            }
          }
        } else {
          var authr = doc.author.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
          if (authr.length > 0) {
            for (var idx in authr) {
              if (authr[idx] != ' ' && authr[idx] != "" && authr[idx] != "the" && authr[idx] != "an" && authr[idx] != "a")
                emit(authr[idx], doc._id);
            }
          }
        }
      }
    }
  },
  resourceName: {
    map: function(doc) {
      if (doc.title) {
        emit(doc._id, doc.title);
      }
    }
  },
  resourceOnTtile: {
    map: function(doc) {
      if (doc.title) {
        emit(doc.title, doc._id);
      }
    }
  },
  resourceswithstartkey: {
    map: function(doc) {
      if (doc.title) {
        emit(doc.title, true)
      }
    }
  },
  sortresources: {
    map: function(doc) {
      if (doc.title) {
        emit(doc.title, true)
      }
    }
  },
  welcomeVideo: {
    map: function(doc) {
      if (doc.isWelcomeVideo) {
        emit(doc._id, true)
      }
    }
  },
  searchResourcesBySubsetOfTitleWords: {
    map: function(doc) {
      if (doc.title) {
        var txt = doc.title;
        var prefix = txt.replace(/[!(.,;):]+/g, "").toLowerCase().split(" ");
        if (prefix.length > 0) {
          for (var idx in prefix) {
            if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a")
              emit(prefix[idx], doc._id);
          }
        }
      }
    }
  }
}

module.exports = ddoc;