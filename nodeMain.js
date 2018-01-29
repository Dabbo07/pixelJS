var app = {};

var canvas;
var ctx;
var nodeCol = 0;
var scanNodes = [0];
var scanTick = 0;
var scanId = 0;
var nt;

var start = function() {

    var maxNodes = 60;
    var targetNodeId = 5;
    var maxConnectors = 80;
    
    console.log("Started");
    nt = app.NodeTraversalService;
    canvas = document.getElementById("canvasMain");
    ctx = canvas.getContext("2d");

    for (var i = 0; i < maxNodes; i++) {
        var newNode = {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 800),
            connections: []
        };
        nt.nodes.push(newNode);

        if (i === 0) {
            ctx.fillStyle = '#a0a0ff';    
        } else if (i === targetNodeId) {
            ctx.fillStyle = '#ffa0a0';
        } else {
            ctx.fillStyle = '#e0e0e0';
        }
        ctx.beginPath();
        ctx.arc(newNode.x, newNode.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.font = "8px Arial";
        ctx.fillText(i, newNode.x + 8, newNode.y + 2);
    };

    for (var i = 0; i < maxConnectors; i++) {
        var selNode;
        var targNode;
        var invalidSelection = true;
        while (invalidSelection) {
            selNode = Math.floor(Math.random() * maxNodes);
            targNode = Math.floor(Math.random() * maxNodes);
            if (selNode != targNode) {
                var foundDup = false;
                nt.nodes[selNode].connections.forEach(function(item, index, arr) {
                    if (item === targNode) foundDup = true;
                });
                if (!foundDup) {
                    nt.nodes[selNode].connections.push(targNode);
                    nt.nodes[targNode].connections.push(selNode);
                    invalidSelection = false;
                };
            };
        };
    };

    nt.nodes.forEach(function(selNode, index, arr) {
        selNode.connections.forEach(function(targNode, index1, arr1) {
            ctx.beginPath();
            ctx.moveTo(selNode.x, selNode.y);
            ctx.lineTo(nt.nodes[targNode].x, nt.nodes[targNode].y);
            ctx.strokeStyle = '#C0C0C0';
            ctx.stroke();
        });
    });

    var startingNode = nt.createSpiderNodeTrace(0, [0], 0);
    nt.spiderTraverseNode(startingNode);

    for (var i = 0; i < nt.nodeTree.length; i++) {
        console.log("NT#" + i + ": " + JSON.stringify(nt.nodeTree[i].nodes));
    }
    console.log("Size: " + nt.nodeTree.length);

    setTimeout(displayNode, 1000);
};

var displayNode = function() {

    var selNodeTree = nt.nodeTree[scanTick];

    for (var i = 0; i < selNodeTree.nodes.length; i++) {
        if (selNodeTree.nodes[i] === scanNodes[scanId]) {
            // Match, what is next nodeId
            if (i < (selNodeTree.nodes.length - 1)) {
                var nextNodeId = selNodeTree.nodes[i + 1];
                // is nodeId in scanList, if not, add and draw line.
                var foundEntry = false;
                for (var a = 0; a < scanNodes.length; a++) {
                    if (scanNodes[a] === nextNodeId) foundEntry = true;
                };
                if (!foundEntry) {
                    var startNode = nt.nodes[scanNodes[scanId]];
                    var endNode = nt.nodes[nextNodeId];
                    scanNodes.push(nextNodeId);
                    ctx.beginPath();
                    ctx.moveTo(startNode.x, startNode.y);
                    ctx.lineTo(endNode.x, endNode.y);
                    ctx.strokeStyle = '#ff0000';
                    ctx.stroke();
                };
            };
        };
    };


    scanTick++;
    if (scanTick >= nt.nodeTree.length) {
        scanTick = 0;
        scanId++;
        if (scanId > (scanNodes.length - 1)) {
            scanId = scanNodes.length - 1;
        };
    };
    setTimeout(displayNode, 1);
};

app.start = start;

