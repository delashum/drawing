var socket = io();

$(function () {

    var pos = $('#draw').position(),
        left = pos.left,
        top = pos.top;

    $('#draw').mousedown(function (e) {
        var x1, y1, x2, y2;
        $(this).mousemove(function (e) {

            x1 = e.pageX - left;
            y1 = e.pageY - top;

            socket.emit('draw', {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            });

            DrawLine(x1, x2, y1, y2);

            x2 = x1;
            y2 = y1;

        });
    });

    $('body').mouseup(function (e) {
        $('#draw').unbind('mousemove');
    });
});

socket.on('receive', function (data) {
    DrawLine(data.x1, data.x2, data.y1, data.y2);
});


function DrawLine(x1, x2, y1, y2) {
    $('canvas#draw').drawLine({
        strokeStyle: '#000',
        strokeWidth: 2,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    });
}