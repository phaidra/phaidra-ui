angular.module('submitService', [])
.factory('SubmitService', function($http) {
        
        return {
                getTitleMods: function(mods){
                        var title = "";
                        for (i = 0; i < mods.length; ++i) {
                               if(mods[i].xmlname == "titleInfo"){
                                      if(mods[i].children){
                                           for (j = 0; j < mods[i].children.length; ++j) {
                                                  if(mods[i].children[j].xmlname == "title"){
                                                         title = mods[i].children[j].ui_value; 
                                                  }
                                           }
                                      }
                              }
                       }
                       return title;  
                },
                getLanguageMods: function(mods){
                       var language = "";
                             for (i = 0; i < mods.length; ++i) {
                                   if(mods[i].xmlname == "language"){
                                        if(mods[i].children){
                                             for (j = 0; j < mods[i].children.length; ++j) {
                                                  if(mods[i].children[j].xmlname == "languageTerm"){
                                                        language = mods[i].children[j].ui_value; 
                                                   }     
                                             }
                                       }
                                   }   
                             }
                        return language; 
                },
                getDescriptionMods: function(mods){
                              var description = "";
                              for (i = 0; i < mods.length; ++i) {
                                    if(mods[i].xmlname == "note"){
                                          description = mods[i].ui_value;   
                                    }   
                              }
                              return description; 
                },
                getLicenceMods: function(mods){
                            var licence = "";
                            for (i = 0; i < mods.length; ++i) {
                                  if(mods[i].xmlname == "accessCondition"){
                                        licence = mods[i].ui_value;   
                                  }   
                            }
                            return licence; 
                },
                getRolesMods: function(mods){
                            var selectedRoles =  [];
                            var namePart = '';
                            var roleTerm = '';
                            for (i = 0; i < mods.length; ++i) {
                                  if(mods[i].xmlname == "name"){
                                          if(mods[i].children){
                                               namePart = '';
                                               roleTerm = '';
                                               for (j = 0; j < mods[i].children.length; ++j) {
                                                      if(mods[i].children[j].xmlname == "namePart"){
                                                              namePart = mods[i].children[j].ui_value; 
                                                      } 
                                                      if(mods[i].children[j].xmlname == "role"){
                                                             if(mods[i].children[j].children){
                                                                     for (k = 0; k < mods[i].children[j].children.length; ++k) {
                                                                             if(mods[i].children[j].children[k].xmlname == "roleTerm"){
                                                                                     roleTerm = mods[i].children[j].children[k].ui_value;
                                                                             }
                                                                     }  
                                                             }
                                                      }
                                               }
                                               if(roleTerm != '' && namePart != ''){
                                                       var newRole = {};
                                                       newRole.URI = roleTerm;
                                                       var namePartsArray = namePart.split(",");
                                                       newRole.firstname = namePartsArray[0];
                                                       if(namePartsArray[1]){
                                                           namePartsArray[1].trim()    
                                                       }
                                                       newRole.lastname = namePartsArray[1];
                                                       selectedRoles.push(newRole);
                                               }
                                        }
                                  }   
                            }
                            return selectedRoles; 
                },
                getTitleUwmeta: function(uwmeta){
                            var title = "";
                            for (i = 0; i < uwmeta.length; ++i) {
                                  if(uwmeta[i].xmlname == "general"){
                                        if(uwmeta[i].children){
                                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                                      if(uwmeta[i].children[j].xmlname == "title"){
                                                            title = uwmeta[i].children[j].ui_value; 
                                                      }     
                                               }
                                        }
                                  }   
                            }
                            return title;
                },
                getDescriptionUwmeta: function(uwmeta){
                            var description = "";
                            for (i = 0; i < uwmeta.length; ++i) {
                                  if(uwmeta[i].xmlname == "general"){
                                        if(uwmeta[i].children){
                                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                                      if(uwmeta[i].children[j].xmlname == "description"){
                                                            description = uwmeta[i].children[j].ui_value; 
                                                      }     
                                               }
                                        }
                                  }   
                            }
                            return description;
                },
                getLanguageUwmeta: function(uwmeta){
                            var language = "";
                            for (i = 0; i < uwmeta.length; ++i) {
                                  if(uwmeta[i].xmlname == "general"){
                                        if(uwmeta[i].children){
                                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                                      if(uwmeta[i].children[j].xmlname == "language"){
                                                            language = uwmeta[i].children[j].ui_value; 
                                                      }     
                                               }
                                        }
                                  }   
                            }
                            return language;
                },
                getLicenceUwmeta: function(uwmeta){
                            var license = "";
                            for (i = 0; i < uwmeta.length; ++i) {
                                  if(uwmeta[i].xmlname == "rights"){
                                        if(uwmeta[i].children){
                                               for (j = 0; j < uwmeta[i].children.length; ++j) {
                                                      if(uwmeta[i].children[j].xmlname == "license"){
                                                            license = uwmeta[i].children[j].ui_value; 
                                                      }     
                                               }
                                        }
                                  }   
                            }
                            return license;
                },
                getRolesUwmeta: function(uwmeta){
                            var selectedRoles =  [];
                            var firstname = '';
                            var lastname = '';
                            var roleTerm = '';
                            for (i = 0; i < uwmeta.length; ++i) {
                                 if(uwmeta[i].xmlname == "lifecycle"){
                                          if(uwmeta[i].children){
                                                 for (j = 0; j < uwmeta[i].children.length; ++j) {
                                                       if(uwmeta[i].children[j].xmlname == "contribute"){
                                                               firstname = '';
                                                               lastname = '';
                                                               roleTerm = ''; 
                                                               if(uwmeta[i].children[j].children){
                                                                      for (k = 0; k < uwmeta[i].children[j].children.length; ++k) {  
                                                                             if(uwmeta[i].children[j].children[k].xmlname == "entity"){
                                                                                    if(uwmeta[i].children[j].children[k].children){
                                                                                          for (l = 0; l < uwmeta[i].children[j].children[k].children.length; ++l) {
                                                                                                  if(uwmeta[i].children[j].children[k].children[l].xmlname == "firstname"){
                                                                                                        firstname = uwmeta[i].children[j].children[k].children[l].ui_value;
                                                                                                  }
                                                                                                  if(uwmeta[i].children[j].children[k].children[l].xmlname == "lastname"){
                                                                                                        lastname = uwmeta[i].children[j].children[k].children[l].ui_value;
                                                                                                  }
                                                                                          }
                                                                                    } 
                                                                             }
                                                                             if(uwmeta[i].children[j].children[k].xmlname == "role"){
                                                                                    roleTerm = uwmeta[i].children[j].children[k].ui_value;
                                                                            }
                                                                      } 
                                                               }
                                                               if(roleTerm != '' && lastname != '' && firstname != ''){
                                                                     var newRole = {};
                                                                     newRole.URI = roleTerm;
                                                                     newRole.firstname = firstname;
                                                                     newRole.lastname = lastname;
                                                                     selectedRoles.push(newRole);
                                                              }
                                                       } 
                                                 }
                                        }
                                  }   
                            }
                            return selectedRoles; 
                },
                submit_metadata: '',
                submit_language: '',
                submit_title: '',
                submit_description: '',
                submit_licence: '',
                submit_selectedRoles: []
                
               }
});
