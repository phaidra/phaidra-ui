var myModalService = angular.module('massEditService', []);
  
myModalService.factory('Massedit', function() {
                                     return {
				             fieldvalue: "", 
		                              currentField: "",
		                              initdata: "",
		                              records: [], 
		                              datastructure: [],
		                              changesFirst: [],
			                      // add/update  new field with corresponding value to the datastructure in all records
		                              dataStructureUpdate: function(fieldvalue, fieldname, datastructure) {
								     if('undefined' !== typeof fieldname ){
								       	 var fieldExist = 0;
									 if('undefined' !== typeof datastructure[0].changes ){
									      for(var m = 0 ; m < datastructure[0].changes.length ; m++) {
									            if(datastructure[0].changes[m].field === fieldname){
									                  fieldExist = 1;
									            } 
								               }
									 } 
                                                                            loop1:
									 for( var j = 0 ; j < datastructure.length ; j++ ){
								               if('undefined' !== typeof datastructure[j].changes && datastructure[j].changes.length > 0){
									            loop2:
										    for(var k = datastructure[j].changes.length - 1; k >= 0; k--) {
										        if(fieldExist){
											    if(datastructure[j].changes[k].field === fieldname){
											         datastructure[j].changes[k].value = fieldvalue;
											    }
										        }
										        else{
											        var newfield = {};
											        newfield.field = fieldname;
											        newfield.value = fieldvalue;
											        datastructure[j].changes.push(newfield);
												continue loop1;
										       }
									            }
									        }else{
										     var changes = [];
										     var newfield = {};
								                      newfield.field = fieldname;
									              newfield.value = fieldvalue;
										     changes.push(newfield);
										     datastructure[j].changes = changes;
										}
									  } 
                                                                        }
                                                                        return datastructure;
                                                                  },
		                             updateDataStructureDisplay: function(page, datastructure, recordsPerPage) {
	                                                                      var start  = (page-1)*recordsPerPage ;
	                                                                      var max = (page-1)*recordsPerPage + recordsPerPage - 1;
									    var datastructuredisplay = [];
	                                                                      for (var i = start; i <= max  ; i++) {
	                                                                             if('undefined' !== typeof datastructure[i] ){ 
		                                                                             datastructuredisplay.push(datastructure[i]);
		                                                                     }
	                                                                      }
					                                     return datastructuredisplay;
					                                }
				            }
                                   }
		     );

