var app = {};

var canvas;
var ctx;
var lastMousePos = {};
var selectedNode = -1;
var startNode = -1;
var endNode = -1;
var fastestPathNodes = [];

var start = function() {
    console.log("STARTED");

    canvas = document.getElementById("canvasMain");
    ctx = canvas.getContext("2d");

    canvas.addEventListener('click', onCanvasClick, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('keydown', onKeyDown, false);

    nt = app.NodeTraversalService;

    setInterval(drawNodes, 100);

};

var onKeyDown = function(event) {
    //console.log("KeyDown: " + event.keyCode);
    if (selectedNode > -1) {
        switch(event.keyCode) {
            case 83:
                if (endNode != selectedNode) {
                    if (startNode === selectedNode) {
                        startNode = -1;
                    } else {
                        startNode = selectedNode;
                    };
                    selectedNode = -1;
                };
                showNominalPath();
                break;
            case 69:
            if (startNode != selectedNode) {
                if (endNode === selectedNode) {
                    endNode = -1;
                } else {
                    endNode = selectedNode;
                };
                selectedNode = -1;
                showNominalPath();
            };
            break;
        };
    };
};

var showNominalPath = function() {
    if (startNode >= 0 && endNode >= 0) {
        console.log("Calculating... ");
        nt.nodeTree = [];
        var startingNode = nt.createSpiderNodeTrace(startNode, [startNode], 0);
        nt.spiderTraverseNode(startingNode, endNode);
        console.log("Totoal Nodes: " + nt.nodeTree.length);
        fastestPathNodes = nt.getBestPath();
        console.log("Done : " + JSON.stringify(fastestPathNodes));
    };
};

var onMouseMove = function(event) {
    lastMousePos = {
        x: (event.clientX - canvas.offsetLeft),
        y: (event.clientY - canvas.offsetTop)
    };
};

var onCanvasClick = function(event) {
    var mouseX = event.clientX - canvas.offsetLeft;
    var mouseY = event.clientY - canvas.offsetTop;
    var nodeHit = false;
    for (var i = 0; i < nt.nodes.length; i++) {
        var endNode = nt.nodes[i];
        if (mouseX >= (endNode.x - 25) && mouseX <= (endNode.x + 25)) {
            if (mouseY >= (endNode.y - 25) && mouseY <= (endNode.y + 25)) {
                nodeHit = true;
                if (selectedNode === i) {
                    selectedNode = -1;
                } else {
                    if (selectedNode != -1) {
                        var sourceNode = nt.nodes[selectedNode];
                        // check if connection already exists, if so, remove it.
                        var existingConnection = false;
                        for (var a = 0; a < endNode.connections.length; a++) {
                            if (endNode.connections[a] === selectedNode) {
                                existingConnection = true;
                                endNode.connections.splice(a, 1);
                                for (z = 0; z < sourceNode.connections.length; z++) {
                                    if (sourceNode.connections[z] === i) {
                                        sourceNode.connections.splice(z, 1);
                                    };
                                };
                            };
                        };
                        // Create new connection
                        if (!existingConnection) {
                            sourceNode.connections.push(i);
                            endNode.connections.push(selectedNode);
                        };
                        selectedNode = -1;
                        showNominalPath();
                    } else {
                        selectedNode = i;
                    };
                };
                break;
            };
        };
    };
    if (!nodeHit) {
        var newNode = {
            x: mouseX,
            y: mouseY,
            connections: []
        };
        nt.nodes.push(newNode);
    };
};

var drawNodes = function() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1000, 800);
    var divOut = document.getElementById("nodeOutput");
    var strOut = "";
    for (var i = 0; i < nt.nodes.length; i++) {
        var selNode = nt.nodes[i];

        var conflict = "";
        for (var xx = 0; xx < selNode.connections.length; xx++) {
            var checkNode = nt.nodes[selNode.connections[xx]];
            var foundSelf = false;
            for (var yy = 0; yy < checkNode.connections.length; yy++) {
                if (checkNode.connections[yy] === i) foundSelf = true;
            };
            if (!foundSelf) {
                conflict = " -! Missing REF !-";
            };
        };

        strOut = strOut + "Node #" + i + ", " + selNode.connections + conflict + "<br/>";

        selNode.connections.forEach(function(targNode, index1, arr1) {
            ctx.beginPath();
            ctx.strokeStyle = '#C0C0C0';
            ctx.moveTo(selNode.x, selNode.y);
            ctx.lineTo(nt.nodes[targNode].x, nt.nodes[targNode].y);
            ctx.stroke();
            var dist = nt.distanceCalc(selNode.x, selNode.y, nt.nodes[targNode].x, nt.nodes[targNode].y);
            var lowX = selNode.x;
            var highX = nt.nodes[targNode].x;
            var lowY = selNode.y;
            var highY = nt.nodes[targNode].y;
            if (lowX > highX) {
                lowX = highX;
                highX = selNode.x;
            };
            if (lowY > highY) {
                lowY = highY;
                highY = selNode.y;
            };
            var centX = lowX + (Math.abs(highX - lowX) / 2) + 5;
            var centY = lowY + (Math.abs(highY - lowY) / 2) + 5;
            //console.log("1X: " + selNode.x + " 1Y: " + selNode.y + " - 2X: " + nt.nodes[targNode].x + " 2Y: " + nt.nodes[targNode].y + " - LOWX: " + lowX + " LOWY:" + lowY + " - centX: " + centX + " centY:" + centY);
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.font = "10px Arial";
            ctx.fillText(parseInt(dist), centX, centY);
        });

        if (lastMousePos.x >= (selNode.x - 25) && lastMousePos.x <= (selNode.x + 25)) {
            if (lastMousePos.y >= (selNode.y - 25) && lastMousePos.y <= (selNode.y + 25)) {
                ctx.beginPath();
                ctx.strokeStyle = "#0000ff";
                ctx.rect(selNode.x - 15, selNode.y - 15, 30, 30);
                ctx.stroke();
            };
        };

        if (selectedNode === i) {
            ctx.beginPath();
            ctx.strokeStyle = "#ff0000";
            ctx.rect(selNode.x - 15, selNode.y - 15, 30, 30);
            ctx.stroke();
        };

        ctx.fillStyle = '#606060';
        if (i === startNode) {
            ctx.fillStyle = '#009900';
        } else if (i === endNode) {
            ctx.fillStyle = '#990000';
        };
        ctx.beginPath();
        ctx.arc(selNode.x, selNode.y, 12, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.font = "9px Arial";
        ctx.fillText(i, selNode.x - 4, selNode.y + 2);
    };

    if (fastestPathNodes.length > 0) {
        var currentNodeId = fastestPathNodes[0];
        for (var z = 1; z < fastestPathNodes.length; z++) {
            var nextNodeId = fastestPathNodes[z];
            ctx.beginPath();
            ctx.moveTo(nt.nodes[currentNodeId].x, nt.nodes[currentNodeId].y);
            ctx.lineTo(nt.nodes[nextNodeId].x, nt.nodes[nextNodeId].y);
            ctx.strokeStyle = '#0000ff';
            ctx.stroke();
            currentNodeId = nextNodeId;
        };
    };

    divOut.innerHTML = strOut;
};


app.start = start;