'use strict';
let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },

    selectQuestionType (selectQType,question_name,wait_for_element){
        I.selectOption(selectQType,question_name);
    },
    questionFillupAndSave (marksInputField, marks, savequestion ){
        I.fillField(marksInputField, marks);
        I.click(savequestion);
        I.seeInPopup('Question has been saved');
        I.acceptPopup();
        I.wait(4);
    }
}
