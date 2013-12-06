$(function() {
  App.Views.CoursesChartProgress = Backbone.View.extend({

    tagName: "div",
	arrayOfData: new Array,
	temp:new Array,
    addOne: function(model){
    this.temp=[]
      console.log(model.toJSON())
	  var data=model.toJSON().stepsStatus
	  total=model.toJSON().stepsStatus.length
	  passed=0
	  for(var i=0;i<total;i++){
		if(data[i]=="1"){
		  passed++
		}
	  }
	  
	  course=new App.Models.Group({_id:model.toJSON().courseId})
		course.fetch({async:false})
		console.log(course.toJSON())
		this.temp.push(Math.round((passed/total)*100))
		this.temp.push(course.toJSON().name)
		this.temp.push(course.toJSON().backgroundColor)
		this.arrayOfData.push(this.temp)
		
/*		
		arrayOfData = new Array(
   [10.3,'Jan','#222222'],
   [15.2,'Feb','#7D252B'],
   [13.1,'Mar','#EB9781'],
   [16.3,'Apr','#FFD2B5'],
   [14.5,'May','#4A4147']
);

*/
		
 
      //this.$el.append(modelView.el)
    },

    BuildString: function(){
      
		if(this.collection.length!=0){
			this.collection.each(this.addOne, this)
		}
		else{
		alert("No Data Found on Server")
		}
    },

    render: function() {
    this.arrayOfData=[]
      this.BuildString()
      $('#graph').jqbargraph({
   data: this.arrayOfData,
   postfix: '%',
}); 
    }

  })

})


