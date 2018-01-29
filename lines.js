(function () {

    var rootApp = app;

    var lineApp = function() {
        var canvas;
        var ctx;
        
        var lines = [];
        var maxLines = 100;
        var timeSecs = 1;
        
        function newPoint() {
            var rx = Math.ceil(Math.random() * 300);
            var ry = Math.ceil(Math.random() * 300);
            var rsX = -4 + Math.ceil(Math.random() * 9);
            var rsY = -4 + Math.ceil(Math.random() * 9);
            var redCol = Math.floor(Math.random() * 256);
            var bluCol = Math.floor(Math.random() * 256);
            var grnCol = Math.floor(Math.random() * 256);
            return {
                x : rx,
                y : ry,
                spdX : rsX,
                spdY : rsY,
                red: redCol,
                blu: bluCol,
                grn: grnCol
            };
        };
        
        function setUp(canvasTarget) {
            canvas = document.getElementById(canvasTarget);
            ctx = canvas.getContext("2d");
            for (var i = 0; i < maxLines; i++) {
                var lineP = {
                    startP : newPoint(),
                    endP : newPoint()
                };
                lines.push(lineP);
            };
            setTimeout(timerHandler, timeSecs);
        };
        
        function drawPoints() {
            for (var i = 0; i < lines.length; i++) {
                var lineP = lines[i];
                ctx.beginPath();
                ctx.moveTo(lineP.startP.x, lineP.startP.y);
                ctx.lineTo(lineP.endP.x, lineP.endP.y);
                ctx.strokeStyle = 'rgba(' + lineP.startP.red + ',' + lineP.startP.blu + ',' + lineP.startP.grn + ',.5)';
                ctx.stroke();
            }
        }
        
        function movePoints() {
            for (var i = 0; i < lines.length; i++) {
                var lineP = lines[i];
                moveSinglePoint(lineP.startP);
                moveSinglePoint(lineP.endP);
            }
        }
        
        function moveSinglePoint(pointRef) {
            var change = false;
            pointRef.x = pointRef.x + pointRef.spdX;
            if (pointRef.x < 0) {
                pointRef.x = 0;
                pointRef.spdX = (1 + Math.ceil(Math.random() * 9));
                change = true;
            }
            if (pointRef.x > 300) {
                pointRef.x = 300;
                pointRef.spdX = -(1 + Math.ceil(Math.random() * 9));
                change = true;
            }
            pointRef.y = pointRef.y + pointRef.spdY;
            if (pointRef.y < 0) {
                pointRef.y = 0;
                pointRef.spdY = (1 + Math.ceil(Math.random() * 9));
                change = true;
            }
            if (pointRef.y > 300) {
                pointRef.y = 300;
                pointRef.spdY = -(1 + Math.ceil(Math.random() * 9));
                change = true;
            }
            if (change) {
                pointRef.red = Math.floor(Math.random() * 256);
                pointRef.blu = Math.floor(Math.random() * 256);
                pointRef.grn = Math.floor(Math.random() * 256);
            }
        }
        
        function timerHandler() {
            drawPoints();
            movePoints();
            setTimeout(timerHandler, timeSecs);
        }

        return {
            setUp: setUp
        }

    };

    rootApp.lineApp = lineApp().setUp;

})();
