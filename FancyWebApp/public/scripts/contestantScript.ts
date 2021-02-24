/// <reference path="./socket.io.ts" />
$(document).ready(() => {

    $('#sign-up-to-comp').on('click', function (elem) {
        //var jump = {
        //    height: String,
        //    jumpCode: String,
        //    jumpScore: String
        //}
        var contestant = {
            userId: "derp",
            jumps: []
        }

        var data = {};
        //var i = 0;
        $('#the-jump-codes :input').each(function (index, element) {
            var jump = {
                height: $('#competitionHeight').val(),
                jumpCode: "",
                jumpScore: ""
            }
            jump.jumpCode = $(element).val();
            contestant.jumps[index] = jump;
            //i++;

        });

        console.log(contestant);

        //socket.emit('contestant-sign-up', )
    });
});