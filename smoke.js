(function () {

    var rootApp = app;

    var smokeApp = function() {

        var canvas;
        var ctx;
        
        var timeSecs = 10;
        var maxPlumes = 1000;
        
        var smokeArray = [];
        var ox = 150;
        var oy = 250;
        
        function setUp(canvasTarget) {
            canvas = document.getElementById(canvasTarget);
            ctx = canvas.getContext("2d");
            setTimeout(timerHandler, timeSecs);
        };
        
        function createSmoke() {
            var smoke = {
                x : ox,
                y : oy,
                size : 1,
                col : 'rgba(200,200,0,.25)'
            }
            smokeArray.push(smoke);
        }
        
        function drawSmokes() {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 300, 300);
            for (var i = 0; i < smokeArray.length; i++) {
                var smoke = smokeArray[i];
                ctx.fillStyle = smoke.col;
                ctx.beginPath();
                ctx.arc(smoke.x, smoke.y, smoke.size, 0, 2 * Math.PI, false);
                ctx.fill();
                //ctx.stroke();
            }
        }
        
        function moveSmokes() {
            for (var i = 0; i < smokeArray.length; i++) {
                var smoke = smokeArray[i];
        
                smoke.y = smoke.y -1;
                if (Math.random() > .85) smoke.x = smoke.x + 1;
                if (Math.random() > .75) smoke.size = smoke.size + 1;
                if (smoke.y < 235) smoke.col = 'rgba(200, 0, 0, .25)';
                if (smoke.y < 210) smoke.col = 'rgba(0, 0, 0, .5)';
                if (smoke.y < 165) smoke.col = 'rgba(75, 75, 75, .5)';
                if (smoke.y < 110) smoke.col = 'rgba(125, 125, 125, .5)';
                if (smoke.y < 75) smoke.col = 'rgba(200, 200, 200, .5)';
                if (smoke.y < 50) {
                    smokeArray.splice(i, 1);
                }
            }
        }
        
        function timerHandler() {
            if (smokeArray.length < maxPlumes && Math.random() > .75) {
                createSmoke();
            };
            drawSmokes();
            moveSmokes();
        
            setTimeout(timerHandler, timeSecs);
        }
    
        return {
            setUp: setUp
        };
    };

    rootApp.smokeApp = smokeApp().setUp;

})();