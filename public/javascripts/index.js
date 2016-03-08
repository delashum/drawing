var socket = io();
color = RandomColor();
user = '';

$(function () {

    $('canvas').attr('height', $(window).height() * 0.7);
    $('canvas').attr('width', $('div.panel-body').width());

    $('#draw').mousedown(function (e) {
        var x1, y1, x2, y2;
        var pos = $('#draw').position(),
            screen = $(window).width(),
            offset = (screen < 768) ? 0 : 250,
            left = pos.left + 250,
            top = pos.top;
        $(this).mousemove(function (e) {

            x1 = e.pageX - left;
            y1 = e.pageY - top;

            socket.emit('draw', {
                color: color,
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            });

            DrawLine(x1, x2, y1, y2, color);

            x2 = x1;
            y2 = y1;

        });
    });

    $('body').mouseup(function (e) {
        $('#draw').unbind('mousemove');
    });
});

socket.on('receive', function (data) {
    DrawLine(data.x1, data.x2, data.y1, data.y2, data.color);
});


function DrawLine(x1, x2, y1, y2, color_in) {
    $('canvas#draw').drawLine({
        strokeStyle: color_in,
        strokeWidth: 2,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    });
}

function RandomColor() {

    var string = '#';

    for (var x = 0; x < 3; x++) {
        string += toHex(Math.random() * 255);
    }

    return string;
}

function toHex(n) {
    n = Number(n.toFixed(0));
    var hex = n.toString(16);
    while (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}




var app = angular.module('app', []);

app.controller('ctrl', ['$scope', function ($scope) {

    $scope.users = [];

    socket.on('add-user', function (data) {
        $scope.users.push(data);

        var temp = {
            color: data.color,
            data: $scope.users
        };

        if (data.color != color) {
            socket.emit('send-update', temp);
        }
    });

    socket.on('receive-update', function (data) {
        if (data.color == color) {
            $scope.users = data.data;
        }
        $scope.$apply();
    });

    socket.on('remove-user', function (data) {
        $scope.users.forEach(function (e, i) {
            if (e.username == data) {
                $scope.users.splice(i, 1);
            }
        });

        $scope.$apply();
    });



    $scope.Login = function () {

        user = $scope.username;

        if (user == undefined || user == "") {
            Message('Please enter something');
            return;
        }

        var data = {
            username: $scope.username,
            color: color
        };

        socket.emit('new-user', data);

        $('.white-over').fadeOut();
        $('.login').slideUp();
    }
    
    $scope.changecolor = function(){
	color = RandomColor();
	$scope.users.forEach(function (e, i) {
            if (e.username == user) {
                e.color = color; 
            }
        }); 
    }

    $scope.Clear = function () {
        $('canvas').clearCanvas();
    }

}]);

window.onbeforeunload = function (event) {
    socket.emit('logout', user);
    return null;
};

function Message(message) {
    $('div#message').html(message).slideDown('fast');
}
