$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",
	id:"collectionTable",
	display:false,
    className: "table table-striped",
    initialize:function(options){
    	
    //consoe.log(options)
    ///alert('here in collection table')
    },
	addOne: function(model){


      	 var collectionRow = new App.Views.CollectionRow({model: model})
      		 collectionRow.display=this.display
      		 collectionRow.render()  ;

      	this.$el.append(collectionRow.el)
    },
    events : {
		"click .clickonalphabets" : function(e)
		{
			this.collection.skip = 0
			var val = $(e.target).text()
			this.collection.startkey = val
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}	
		},
		"click #allresources" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = 0
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		"click #mergeCollection" :function(e){
		    this.displayMergeForm()
		},
		"click #nextButton" :function(e){
		    this.collection.skip += 20
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		"click #preButton" :function(e){
		    this.collection.skip -= 20
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		}
		
	},
	displayMergeForm:function(){
	
	          $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show();
				$('#invitationdiv').html('<div id="mainMergeDiv"></div>');
                $('#mainMergeDiv').append('<h5 style="margin-top:40px">'+App.languageDict.attributes.Select_Collections_Merge+'<h5>')

                var viewText='<p style=""><label style="margin-left:20px"><b>'+App.languageDict.attributes.Collection_s+'</b></label><select multiple="true" style="width:400px;" id="selectCollections">'
                    this.collection.each(function(coll){
                         viewText+='<option value="'+coll.get('_id')+'">'+coll.get('CollectionName')+'</option>'
                    
                    })
                viewText+='</select></p>'
                
                $('#mainMergeDiv').append(viewText)
                
                $('#mainMergeDiv').append('<br><div id="mergeCollectionDiv"><label style=""><b>'+App.languageDict.attributes.Name+'</b></label><input id="collectionName" type="text"></input></div>')
                $('#invitationdiv select').multiselect().multiselectfilter();
				$('#invitationdiv select').multiselect({
					checkAllText: App.languageDict.attributes.checkAll,
					uncheckAllText: App.languageDict.attributes.unCheckAll,
					selectedText: '# '+App.languageDict.attributes.Selected
				});
		$('#invitationdiv select').multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
		$('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                $('#invitationdiv select').multiselect('uncheckAll');
				$('#invitationdiv select').multiselect({
					header: App.languageDict.attributes.Select_An_option,
					noneSelectedText: App.languageDict.attributes.Select_An_option
				});

               
                $('#mainMergeDiv').append('<br><br>')
                $('#mainMergeDiv').append('<button class="btn btn-success" style="margin-left:40px" id="continueMerging" onClick="continueMerging()">'+App.languageDict.attributes.Continue+'</button>')
                $('#mainMergeDiv').append('<button class="btn btn-danger" style="margin-left:20px"  id="cancelMerging" onClick="cancelMerging()">'+App.languageDict.attributes.Cancel+'</button>')
				if(App.configuration.attributes.currentLanguage=="Urdu" || App.configuration.attributes.currentLanguage=="Arabic" )
				{
					$('#mainMergeDiv').find('h5').eq(0).css('margin-right','2%');  //40px
					$('#mainMergeDiv').find('label').css('margin-left','20px'); //60px
					$('#mainMergeDiv').find('p').css('margin-right','2%');    //20px
					$('#mergeCollectionDiv').css('margin-right','2%');
					$('#continueMerging').css('margin-right','40px');
					$('#cancelMerging').css('margin-right','20px');
				}
			else {
					$('#mainMergeDiv').find('h5').eq(0).css('margin-left','40px');
					$('#mainMergeDiv').find('p').css('margin-left','20px');
					$('#mainMergeDiv').find('label').css('margin-left','40px');
					$('#mergeCollectionDiv').css('margin-left','2%');
					$('#continueMerging').css('margin-left','40px');
					$('#cancelMerging').css('margin-left','20px');
				}

	},
    addAll: function(){

    
    	var header="<tr><th colspan='6'><span id='firstLabelOnCollections'>"+App.languageDict.attributes.Collection_s+"</span>"
            if(this.display==true)
              header+="<a id='mergeCollection' class='btn btn-info small'>"+App.languageDict.attributes.Merge+"</a>"
    	      header+="</th></tr>"
    	this.$el.html(header)
				var viewText="<tr></tr>"
			
				viewText+="<tr><td id='alphabetsOnCollections' colspan=7>"
				viewText+='<a  id="allresources" >#</a>&nbsp;&nbsp;'
		var str = [] ;
		str = App.languageDict.get("alphabets");
		for (var i = 0; i < str.length; i++) {
			var nextChar = str[i];
			viewText += '<a class="clickonalphabets"  value="' + nextChar + '">' + nextChar + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		}
				viewText+="</td></tr>"
				this.$el.append(viewText)
    	
    	
    	  
  		this.collection.forEach(this.addOne, this)
  		
  		var nextPre='<tr><td>'
  		if(this.collection.length >= 20)
  		{
  		  if(this.collection.skip>=20)
  		   nextPre+='<button class="btn btn-success" id="preButton">'+App.languageDict.attributes.Back+'</buttton>'
  		  
  		  nextPre+='<button class="btn btn-success" id="nextButton">'+App.languageDict.attributes.Next+'</buttton>'
  		
  		}
  		nextPre+='</td></tr>'
  		this.$el.append(nextPre)
  		
    },

    render: function() {


	   
    	var roles=this.getRoles()
    	if(roles.indexOf('Manager')>=0)
    	{
    		this.display=true
    	}
    	else{
    		this.display=false
    	}
      this.addAll()
    },
     getRoles:function(){
        
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            
            return roles
        }

  })

})


