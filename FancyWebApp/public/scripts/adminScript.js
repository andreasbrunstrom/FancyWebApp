/// <reference path="./socket.io.ts" />
$(document).ready(function () {
    $('.removeCompetition').on('click', function (elem) {
        if (confirm('Är du säker på att du vill ta bort tävlingen?') == true) {
            var li = $(elem.currentTarget).closest('li');
            socket.emit('competitionDelete', $(li).data('competition-id'));
            li.remove();
        }
    });
    $('#competitionSave').on('click', function () {
        var comp = {
            id: $('#competitionId').val(),
            name: $('#competitionName').val(),
            gender: Number($('#competitionGender').val()),
            syncro: Boolean($('#competitionSync').val()),
            height: Number($('#competitionHeight').val()),
            date: new Date($('#competitionDate').val()),
            ageGroup: $('#competitionAgeGroup').val(),
            rounds: Number($('#competitionRounds').val()),
            judges: [],
            contestants: []
        };
        $('#judgeList li').each(function (index, judge) {
            comp["judges"].push({
                "userId": $(judge).data("userid")
            });
        });
        $('#contestants li.contestant').not('#dummyContestant').each(function (index, contestant) {
            comp["contestants"].push({
                userId: $(contestant).data("userid"),
                jumps: [],
                totalscore: 0
            });
            $(contestant).find('.jumpData').each(function (jumpIndex, jump) {
                comp['contestants'][index]['jumps'].push({
                    height: $(jump).find('.jumpHeight').text(),
                    jumpCode: $(jump).find('.jumpCode').val(),
                    jumpScore: $(jump).find('.jumpScore').text()
                });
            });
        });
        socket.emit('competitionSave', JSON.stringify(comp, null, ' '));
    });
    $('#btn-add-user').on('click', function () {
        if ($('#usertitle').html() === "domare") {
            $('#userlist li').each(function (index, elem) {
                if ($(elem).children('input:checked').length > 0) {
                    var handle = $('<div>').addClass('dragHandle');
                    var span = $('<span>').addClass('judgeName').text($(elem).text());
                    var icon = $('<i>').addClass('material-icons').text('close');
                    var close = $('<a>').addClass('closeButton removeJudge').append(icon).attr('href', 'javascript:void(0)');
                    var li = $('<li>').addClass('collection-item').attr('data-userid', $(elem).data('userid')).append(handle).append(span).append(close);
                    $('#judgeList').append(li);
                }
            });
        }
        else if ($('#usertitle').html() === "deltagare") {
            //console.log("add cont");
            $('#userlist li').each(function (index, elem) {
                if ($(elem).children('input:checked').length > 0) {
                    var li = $('#dummyContestant').clone(true, true);
                    li.removeClass('hide');
                    li.removeAttr('id');
                    li.attr('data-userid', $(elem).data('userid'));
                    li.find('.contestantName').text($(elem).text());
                    $(li).insertBefore('#emptyRow');
                }
            });
        }
        $('#modal-userlist').modal('close');
    });
    $('#judgeList').on('click', '.removeJudge', function (elem) {
        $(elem.currentTarget).parents('li').remove();
    });
    $('#contestants').on('click', '.removeContestant', function (elem) {
        $(elem.currentTarget).parents('li').remove();
    });
    // STARTA EN TÄVLING.
    $('#competitionStart').on('click', function () {
        $('#competitionSave').click();
        if ($('.jumpCode').not('#dummyContestant .jumpCode').filter(function (index, item) { return item.value == ''; }).length != 0) {
            Materialize.toast('Alla deltagare har inte angivit hoppkod. Tävlingen ej startad.', 4000);
        }
        else if ($('#judgeList li').length != 3 && $('#judgeList li').length != 5 && $('#judgeList li').length != 7) {
            Materialize.toast('Fel antal domare, lägg till 3, 5 eller 7 st. Tävlingen ej startad.', 4000);
        }
        else {
            socket.emit('competitionStart', JSON.stringify($('#competitionId').val()));
            $('#competitionPause').closest('li').show();
            $('#nextJump').closest('li').show();
            $('#competitionStart').closest('li').hide();
        }
    });
    $('#competitionPause').on('click', function () {
        $('#competitionStart').closest('li').show();
        $('#competitionPause').closest('li').hide();
        $('#nextJump').closest('li').hide();
    });
    $('#competitionReset').on('click', function () {
        socket.emit('competitionReset', $('#competitionId').val());
    });
    // För att sKlicka nästa hopp till domarna (servern sKlickat hopparen till alla domare)
    $('#nextJump').on('click', function () {
        socket.emit('nextJump', $('#competitionId').val());
    });
    $('#userCreate').on('click', function (elem) {
        var form = $(elem.target).closest('form');
        var data = {};
        form.find(':input').each(function (index, element) {
            if (element.type !== 'button' && element.id !== '') {
                data[element.id] = $(element).val();
            }
        });
        if (data['username'] === '' || data['username'].length < 6) {
            Materialize.toast('Ange ett användarnamn, minst 6 tecken!', 4000);
            return;
        }
        if (data['name'] === '' || data['name'].length < 6) {
            Materialize.toast('Ange ett namn!', 4000);
            return;
        }
        if (data['password'].length < 3) {
            Materialize.toast('För kort lösenord!', 4000);
            return;
        }
        if (data['password'] !== data['repeatPassword']) {
            Materialize.toast('Lösenorden stämmer inte överens!', 4000);
            return;
        }
        console.log(data);
        socket.emit('createUser', JSON.stringify(data));
    });
    socket.on('competitionResetDone', function () {
        $('#competitionStart').closest('li').show();
        $('#competitionReset').closest('li').hide();
        $('.jumpScore').text('');
        $('.totalScore').text('');
        Materialize.toast('Tävlingen återställd.', 4000);
    });
    socket.on('competitionEnded', function () {
        $('#competitionPause').closest('li').hide();
        $('#nextJump').closest('li').hide();
        $('#competitionReset').closest('li').show();
        Materialize.toast('Tävlingen avslutad.', 4000);
    });
    socket.on('adminToast', function (msg) {
        Materialize.toast(msg, 4000);
    });
    socket.on('score', function (data) {
        //console.log(JSON.parse(data));
        //alert(JSON.parse(data));
    });
    socket.on('userlist', function (data) {
        var users = JSON.parse(data);
        //console.log(data);
        //console.log("in");
        //console.log(users);
        var found = false;
        users.forEach(function (user, index) {
            for (var judge in $('#judgelist')) {
                if (user.name === $('#judgeName').text()) {
                    found = true;
                }
            }
            for (var cont in $('#contestants')) {
                if (user.name === $('#contestantName').text()) {
                    found = true;
                }
            }
            if (found) { }
            else {
                var cb = '<input type="checkbox" id="' + user._id + '"><label class="filter-value" for="' + user._id + '">' + user.name + '</label>';
                var elem = $('<li>').addClass('collection-item').html(cb).attr('data-userid', user._id);
                $('#userlist').append(elem);
            }
        });
    });
    $('#modal-userlist').modal({
        ready: function (modal, trigger) {
            if (trigger[0].id === "addContestant" && $(modal).find('#usertitle').text() !== 'deltagare') {
                $('#userlist').html('');
                $(modal).find('#usertitle').text('deltagare');
                socket.emit('getUserlist', JSON.stringify({ 'userlevel': 1 }, null, ' '));
            }
            else if (trigger[0].id === "addJudge" && $(modal).find('#usertitle').text() !== 'domare') {
                $('#userlist').html('');
                $(modal).find('#usertitle').text('domare');
                socket.emit('getUserlist', JSON.stringify({ 'userlevel': 2 }, null, ' '));
            }
        }
    });
});
//# sourceMappingURL=adminScript.js.map