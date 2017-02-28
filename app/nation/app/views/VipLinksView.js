$(function() {

    App.Views.VipLinksView = Backbone.View.extend({

        template: $('#template-viplink').html(),
        vars:{},

        events: {
            "click button.copy": function() {
                alert('hello');
                // document.getElementById("addCommunity").submit();
            }
        },

        initialize: function() {
        },

        render: function() {
       	    this.vars.vips = [];
            this.vars.languageDict = App.languageDictValue;
            for(var i=0;i<this.collection.length;i++) {
            	if((this.collection.models[i].attributes.name != '' && this.collection.models[i].attributes.name != undefined && this.collection.models[i].attributes.name != null) ||
            	(this.collection.models[i].attributes.url != '' && this.collection.models[i].attributes.url != undefined && this.collection.models[i].attributes.url != null))
                    this.vars.vips.push(this.collection.models[i].attributes);
            }
            this.$el.html(_.template(this.template,this.vars))
        }

    })

})
// (function() {

//     'use strict';
//   document.body.addEventListener('click', copy, true);
//     function copy(e) {
//     var 
//       t = e.target,
//       c = t.dataset.copytarget,
//       inp = (c ? document.querySelector(c) : null);
//     if (inp && inp.select) {
//       inp.select();

//       try {
//         document.execCommand('copy');
//         inp.blur();
//         t.classList.add('copied');
//         setTimeout(function() { t.classList.remove('copied'); }, 1500);
//       }
//       catch (err) {
//         alert('please press Ctrl/Cmd+C to copy');
//       }
      
//     }
    
//     }

// })();
