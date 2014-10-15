/**
 * Created by omer.yousaf on 9/1/2014.
 */
$(function() {
    App.Models.NationApplication = Backbone.Model.extend({
        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev'))
                    ? App.Server + '/nationapplication/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/nationapplication/' + this.id // For READ
            } else {
                var url = App.Server + '/nationapplication' // for CREATE
            }
            return url
        },
        schema: {
            organization: {
                type: 'Object',
                subSchema: {
                    name: {type: 'Text', validators: ['required']},
                    address: {type: 'Text', validators: ['required']},
                    website: {type: 'Text', validators: ['required', 'url']}
                }
            },
            primaryContact: {
                type: 'Object',
                subSchema: {
                    name: {type: 'Text', validators: ['required']},
                    address: {type: 'Text', validators: ['required']},
                    email: {validators: ['required', 'email']},
                    verifyEmail: {validators: ['email']},
                    phone: {type: 'Text', validators: ['required']}
                }
            },
            bellManager: {
                type: 'Object',
                title: 'BeLL Manager',
                subSchema: {
                    name: {type: 'Text'},
                    address: {type: 'Text'},
                    email: {validators: ['email']},
                    verifyEmail: {validators: ['email']},
                    phone: {type: 'Text'}
                }
            },
            technologyManager: {
                type: 'Object',
                subSchema: {
                    name: {type: 'Text'},
                    address: {type: 'Text'},
                    email: {validators: ['email']},
                    verifyEmail: {validators: ['email']},
                    phone: {type: 'Text'}
                }
            },
            emergencyContact: {
                type: 'Object',
                subSchema: {
                    name: {type: 'Text'},
                    address: {type: 'Text'},
                    email: {validators: ['email']},
                    verifyEmail: {validators: ['email']},
                    phone: {type: 'Text'}
                }
            },
            submittedBy: {
                type: 'Object',
                subSchema: {
                    memberId: {type: 'Text'},
                    date: {type: 'Text'}
                }
            },
            decision: {
                type: 'Object',
                subSchema: {
                    status: {type: 'Text'},
                    bellName: {title: 'BeLL Name', type: 'Text'},
                    url: {title: 'URL', type: 'Text'},
                    authorizedBy: {type: 'Text'},
                    date: {type: 'Text'}
                }
            }

        },
        validate: function (schemaVars) {
//            var errors = null;
            var errMsg = null;
            if (schemaVars.primaryContact.email !== schemaVars.primaryContact.verifyEmail) {
                errMsg = "email and verify email fields of Primary Contact do not match";
//                errors.push(errMsg);
                return errMsg;
            }
            if (schemaVars.bellManager.email !== schemaVars.bellManager.verifyEmail) {
                errMsg = "email and verify email fields of Bell Manager do not match";
//                errors.push(errMsg);
                return errMsg;
            }
            if (schemaVars.technologyManager.email !== schemaVars.technologyManager.verifyEmail) {
                errMsg = "email and verify email fields of Technology Manager do not match";
//                errors.push(errMsg);
                return errMsg;
            }
            if (schemaVars.emergencyContact.email !== schemaVars.emergencyContact.verifyEmail) {
                errMsg = "email and verify email fields of Emergency Contact do not match";
//                errors.push(errMsg);
                return errMsg;
            }
            return errMsg;
        }
    })


})