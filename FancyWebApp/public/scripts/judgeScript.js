/// <reference path="./socket.io.ts" />
$(document).ready(function () {
    // $('#judge-jump').hide();
    // $('#competitionFinished').hide();
    var currentContestant;
    $('#joinCompetition').on('click', function (elem) {
        var competitionId = $('#competitionId').val();
        socket.emit('competitionJoin', JSON.stringify(competitionId));
        $('#judge-waiting').show();
        $(elem.currentTarget).parent().hide();
    });
    socket.on('nextContestant', function (contestant, round) {
        currentContestant = JSON.stringify(contestant);
        //console.log('Nästa hopp att bedömma ' + contestant.jumps[round].jumpCode);
        $('#code').html(contestant.jumps[round].jumpCode);
        $('#judge-jump').slideToggle(1000);
        $('#judge-waiting').hide();
    });
    socket.on('competitionEnded', function () {
        $('#competitionFinished').show();
        $('#judge-waiting').hide();
    });
    $('#up1').on('click', function () {
        var num = Number($('#points').html());
        if (num <= 9.0) {
            num += 1.0;
        }
        else if (num === 9.5) {
            num = 10;
        }
        $('#points').html(num.toFixed(1));
    });
    $('#up05').on('click', function () {
        var num = Number($('#points').html());
        if (num <= 9.5) {
            num += 0.5;
        }
        $('#points').html(num.toFixed(1));
    });
    $('#down1').on('click', function () {
        var num = Number($('#points').html());
        if (num >= 1.0) {
            num -= 1.0;
        }
        else if (num === 0.5) {
            num = 0.0;
        }
        $('#points').html(num.toFixed(1));
    });
    $('#down05').on('click', function () {
        var num = Number($('#points').html());
        if (num >= 0.5) {
            num -= 0.5;
        }
        $('#points').html(num.toFixed(1));
    });
    var countDownDate = new Date("Jan 5, 2018 15:37:25").getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $('#timer').html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
        if (distance < 0) {
            clearInterval(x);
            $('#timer').html("EXPIRED");
        }
    }, 1000);
    $('#sendScore').on('click', function () {
        $('#judge-waiting').show();
        $('#judge-jump').slideToggle(800);
        var score = {};
        score["competitionId"] = $('#competitionId').val();
        score["contestantId"] = currentContestant[0].userId;
        score["judgeId"] = $('#scoreJudgeId').val();
        score["judgeSeat"] = Number($('#scoreJudgeSeat').val());
        score["points"] = Number($('#points').text());
        $('#points').text('0.0');
        socket.emit('scoreSent', JSON.stringify(score));
        console.log(JSON.stringify(score, null, ' '));
    });
    $('#exitCompetition').on('click', function () {
    });
});
//# sourceMappingURL=judgeScript.js.map