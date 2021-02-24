/// <reference path="./socket.io.ts" />
$(function () {
    $('.sortable').sortable({ handle: '.dragHandle', axis: "y" });
    $('.sortable').disableSelection();
});

$(document).ready(function () {

    $('.modal').modal();
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false,
        hover: true,
        gutter: 0,
        belowOrigin: false,
        alignment: 'left',
        stopPropagation: false // Stops event propagation
    });
    $("#toggle-login").on("click", function () {
        $(".navbar-row2").slideToggle(200);
        $("#toggle-login").parent().toggleClass("active");
        $("#login-username").focus();
    });
    $("main").on("click", function () {
        $(".navbar-row2").slideUp(200);
        $("#toggle-login").parent().removeClass("active");
    });

    // Swedish
    jQuery.extend(jQuery.fn.pickadate.defaults, {
        monthsFull: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
        monthsShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
        weekdaysFull: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
        weekdaysShort: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'],
        weekdaysLetter: ["S", "M", "T", "O", "T", "F", "L"],
        today: 'Idag',
        clear: 'Rensa',
        close: 'Stäng',
        firstDay: 1,
        format: 'yyyy-mm-dd',
        formatSubmit: 'yyyy-mm-dd',
        labelMonthNext: 'Nästa månad',
        labelMonthPrev: 'Föregående månad',
        labelMonthSelect: 'Välj månad',
        labelYearSelect: 'Välj år'
    });
    $('.datepicker').pickadate({
        formatSubmit: 'yyyy-mm-dd',
        format: 'yyyy-mm-dd',
        selectMonths: true,
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });



    $('select').material_select();
    $(".button-collapse").sideNav();
    $('#userSaveProfile').on('click', function () {
        var form = $(this).closest('form');
        var data = {
            id: $(form).data('userid')
        };
        form.find(':input').each(function (index, element) {
            if (element.type !== 'button' && element.id !== '') {
                data[element.id] = $(element).val();
            }
        });
        socket.emit('userSave', JSON.stringify(data, null, ' '));
    });
    $('#userChangePassword').on('click', function () {
        var form = $(this).closest('form');
        var data = {
            id: $(form).data('userid')
        };
        form.find(':input').each(function (index, element) {
            if (element.type !== 'button' && element.id !== '') {
                data[element.id] = $(element).val();
            }
        });
        if (data['newPassword'] === '' || data['repeatPassword'] === '' || data['oldPassword'] === '') {
            Materialize.toast('Fyll i alla fält!', 4000);
            return;
        }
        if (data['newPassword'].length < 5) {
            Materialize.toast('För kort lösenord!', 4000);
            return;
        }
        if (data['newPassword'] !== data['repeatPassword']) {
            Materialize.toast('Lösenorden stämmer inte överens!', 4000);
            return;
        }
        socket.emit('userChangePassword', JSON.stringify(data, null, ' '));
    });
    $('#userChangeLevel').on('click', function () {
        var form = $(this).closest('form');
        var data = {
            id: $(form).data('userid')
        };
        form.find(':input').each(function (index, element) {
            if (element.type !== 'button' && element.id !== '') {
                data[element.id] = $(element).val();
            }
        });
        socket.emit('userSave', JSON.stringify(data, null, ' '));
    });
    socket.on('completedJump', function (data) {

        if ($('#competitionId').val() == data.compId) {

            var contestant = $('#contestants li[data-userid="' + data.contestant + '"]');
            var jumps = $(contestant).find('.jumpData');
            $(jumps[data.round]).find('.jumpScore').text(data.jumpScore);
            var totalscore = $(contestant).find('.totalScore').text();
            $(contestant).find('.totalScore').text(Number(totalscore) + data.jumpScore);
            $(contestant).find('.collapsible-header').click();
            console.log(data);
        }
    });
    socket.on('changeUrl', function (url) {
        document.location.href = url;
    });
    socket.on('toast', function (message) {
        Materialize.toast(message, 4000);
    });
    $(':input[type=text].modal-trigger').on('click', function (elem) {
        $("#modal-jumpcodes").modal('open');
        $("#modal-jumpcodes").data('trigger', $(elem.target));
    });
    $(".searchbox").keyup(function () {
        var value = $(this).val();
        var list = $(this).data('filter');
        $(list + " .filter-value:not(:contains(" + value + "))").parent().hide();
        $(list + " .filter-value:contains(" + value + ")").parent().show();
    });
    $.expr[":"].contains = $.expr.createPseudo(function (arg) {
        return function (elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });
    $('#btn-selectJumpcode').on('click', function () {
        var modal = $('#modal-jumpcodes');
        var trigger = modal.data('trigger');
        var selected = $("#selectedJumpcode").val();
        trigger.val(selected);
        modal.find('.searchbox').val('').keyup();
        modal.modal('close');
    });
    $("#jumpcodeslist").on("click", ".collection-item:not(.active)", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#selectedJumpcode").val($(this).find('.filter-value').text());
        //$("#new-series-name").val($(this).text());
    });
});
//# sourceMappingURL=Script.js.map  
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map 
//# sourceMappingURL=Script.js.map