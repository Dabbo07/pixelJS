(function () {

    var rootApp = app;

    var snowApp = function() {
        var canvas;
        var ctx;
        
        var timeSecs = 10;
        var maxSnow = 1000;
        
        var snow = [];
        var ground = [];
        var wind = 0;
        
        function setUp(canvasTarget) {
            canvas = document.getElementById(canvasTarget);
            ctx = canvas.getContext("2d");
            
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 300, 300);
        
            for (var i = 0; i < 300; i++) {
                ground.push(300);
            }
        
            setTimeout(timerHandler, timeSecs);
        };
        
        function createSnowFlake() {

            var findOK = true;
            var rx;
            while (findOK) {
                rx = Math.floor(Math.random() * 300);
                if (rx <= 120 || rx >= 180) findOK = false;
            };

            var spd = 1 + Math.ceil(Math.random() * 4);
            var flake = {
                x: rx,
                y: 0,
                ox: -1,
                oy: -1,
                spdY: spd
            };
            snow.push(flake);
        }
        
        function drawSnowFlakes() {
            for(var i = 0; i < snow.length; i++) {
                var flake = snow[i];
                ctx.fillStyle = '#000000';
                ctx.fillRect(flake.ox, flake.oy, 1, 1);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(flake.x, flake.y, 1, 1);
                flake.ox = flake.x;
                flake.oy = flake.y;
            }
            for (var i = 0; i < ground.length; i++) {
                ctx.beginPath();
                ctx.moveTo(i, 300);
                ctx.lineTo(i, ground[i]);
                ctx.strokeStyle = 'rgb(255,255,255)';
                ctx.stroke();
            }
        }
        
        function moveSnowFlakes() {
            for(var i = 0; i < snow.length; i++) {
                var flake = snow[i];
                flake.y = flake.y + flake.spdY;
                //flake.x = flake.x + Math.floor((Math.random() * wind));
                if (flake.x > 300) {
                    flake.x = flake.x - 300;
                }
                var targ = flake.x;
                if (flake.y >= ground[targ]) {
                    ground[targ] = ground[targ] - 1;
                    snow.splice(i, 1);
                    snowSplash(targ);
                }
            }
        }
        
        function snowSplash(targ) {
        
            // LEFT
            for (var i = targ; i > 1; i--) {
                var left = i - 1;
                var diff = ground[left] - ground[i];
                if (diff > 1) {
                    ground[left] = ground[i] + 1;
                }
            }
        
            // RIGHT
            for (var i = targ; i < 300; i++) {
                var right = i + 1;
                var diff = ground[right] - ground[i];
                if (diff > 1) {
                    ground[right] = ground[i] + 1;
                }
            }
        
        }
        
        function timerHandler() {
            
            if (snow.length < maxSnow && Math.random() > .25) {
                createSnowFlake();
            }
            if (wind < 5 && Math.random() > .5) {
                wind++;
            }
            if (wind > 0 && Math.random() > .5) {
                wind--;
            }
        
            drawSnowFlakes();
            moveSnowFlakes();
            setTimeout(timerHandler, timeSecs);
        }
    
        return {
            setUp: setUp
        };
    };

    rootApp.snowApp = snowApp().setUp;

})();

