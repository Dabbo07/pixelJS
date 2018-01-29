var app = {};

(function() {

    var canvas;
    var ctx;

    var timeout = 10000;
    var maxNodes = 50;
    var targetNodeId = 25;
    var maxConnectors = 100;
    var pathId = 0;
    var nodes = [];

    var start = function() {

        canvas = document.getElementById("canvasMain");
        ctx = canvas.getContext("2d");

        nodeTree = [];

        for (var i = 0; i < maxNodes; i++) {
            var newNode = {
                x: Math.floor(Math.random() * 1000),
                y: Math.floor(Math.random() * 800),
                connections: []
            };
            nodes.push(newNode);

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
        }

        for (var i = 0; i < maxConnectors; i++) {
            var selNode;
            var targNode;
            var invalidSelection = true;
            while (invalidSelection) {
                selNode = Math.floor(Math.random() * maxNodes);
                targNode = Math.floor(Math.random() * maxNodes);
                if (selNode != targNode) {
                    var foundDup = false;
                    nodes[selNode].connections.forEach(function(item, index, arr) {
                        if (item === targNode) foundDup = true;
                    });
                    if (!foundDup) {
                        nodes[selNode].connections.push(targNode);
                        nodes[targNode].connections.push(selNode);
                        invalidSelection = false;
                    };
                };
            };
        };

        nodes.forEach(function(selNode, index, arr) {
            selNode.connections.forEach(function(targNode, index1, arr1) {
                ctx.beginPath();
                ctx.moveTo(selNode.x, selNode.y);
                ctx.lineTo(nodes[targNode].x, nodes[targNode].y);
                ctx.strokeStyle = '#C0C0C0';
                ctx.stroke();
            });
        });

        var nodeTraceItem = {
            parentNodeId: -1,
            pathId: 0,
            searchNodeId: 0,
            distance: 0,
            nodes: [0],
            success: false
        };
        nodeTree.push(nodeTraceItem);
        nodeTraverse(nodeTraceItem);

        var bestPathId = -1;
        var bestDistance = -1;
        for (var i = 0; i < nodeTree.length; i++) {
            if (nodeTree[i].success) {
                if (bestDistance === -1) {
                    bestPathId = i;
                    bestDistance = nodeTree[i].distance;
                } else if (bestDistance > nodeTree[i].distance) {
                    bestPathId = i;
                    bestDistance = nodeTree[i].distance;
                }
            }
            console.log("Path #" + i + " : " + JSON.stringify(nodeTree[i].nodes) + " : Success? " + nodeTree[i].success + ", Distance: " + nodeTree[i].distance);
        }

        console.log("Best Path = " + bestPathId);
        if (bestPathId != -1) {
            var currentNodeId = nodeTree[bestPathId].nodes[0];
            for (var i = 1; i < nodeTree[bestPathId].nodes.length; i++) {
                var nextNodeId = nodeTree[bestPathId].nodes[i];
                ctx.beginPath();
                ctx.moveTo(nodes[currentNodeId].x, nodes[currentNodeId].y);
                ctx.lineTo(nodes[nextNodeId].x, nodes[nextNodeId].y);
                ctx.strokeStyle = '#0000ff';
                ctx.stroke();
                currentNodeId = nextNodeId;
            }
        };
        //nodeProcess(nodeTrace);
    };
    app.start = start;

    var nodeTraverse = function(nodeTraceItem) {
        timeout--;
        if (timeout <= 0) {
            console.log("Time out reached.");
            return;
        };

        var con = nodes[nodeTraceItem.searchNodeId].connections;
        for (var i = 0; i < nodeTraceItem.nodes.length; i++) {
            for (var a = 0; a < con.length; a++) {
                if (nodeTraceItem.nodes[i] === con[a]) {
                    con.splice(a, 1);
                };
            };
        };
        console.log("PATH #" + nodeTraceItem.pathId + ": NODE #" + nodeTraceItem.searchNodeId + " has " + con.length + " connections.");
    
        var lastItemId = con.length - 1;
        for (var i = 0; i < con.length; i++) {
            var selNode = con[i];
            console.log("PATH #" + nodeTraceItem.pathId + ": NODE #" + nodeTraceItem.searchNodeId + " : CONNECTION #" + i + " => NODE #" + selNode);

            var snapNodes = nodeTraceItem.nodes.slice();
            var deltaX = nodes[selNode].x - nodes[nodeTraceItem.searchNodeId].x;
            var deltaY = nodes[selNode].y - nodes[nodeTraceItem.searchNodeId].y;
            var distance = Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));

            if (i == lastItemId) {
                nodeTraceItem.distance = nodeTraceItem.distance + distance;
                if (selNode === targetNodeId) {
                    console.log("PATH #" + nodeTraceItem.pathId + ": NODE #" + nodeTraceItem.searchNodeId + " FIRST CHECK, FOUND TARGET NODE #" + selNode);
                    firstCheck = false;
                    nodeTraceItem.searchNodeId = selNode;
                    nodeTraceItem.success = true;
                    nodeTraceItem.nodes.push(selNode);
                } else {
                    console.log("PATH #" + nodeTraceItem.pathId + ": NODE #" + nodeTraceItem.searchNodeId + " FIRST CHECK, continuing traversal on NODE #" + selNode);
                    firstCheck = false;
                    nodeTraceItem.searchNodeId = selNode;
                    nodeTraceItem.nodes.push(selNode);
                    nodeTraverse(nodeTraceItem);
                };
            } else {
                pathId++;
                var newNodeTraceItem = {
                    parentNodeId: nodeTraceItem.searchNodeId,
                    searchNodeId: selNode,
                    pathId: pathId,
                    distance: nodeTraceItem.distance,
                    nodes: snapNodes.slice(),
                    success: false
                };
                newNodeTraceItem.distance = newNodeTraceItem.distance + distance;
                newNodeTraceItem.nodes.push(selNode);
                if (selNode === targetNodeId) {
                    console.log("PATH #" + newNodeTraceItem.pathId + ": NODE #" + newNodeTraceItem.searchNodeId + " FOUND TARGET for new PATH on NODE #" + selNode);
                    newNodeTraceItem.success = true;
                };
                nodeTree.push(newNodeTraceItem);
                if (selNode != targetNodeId) {
                    console.log("PATH #" + newNodeTraceItem.pathId + ": NODE #" + newNodeTraceItem.searchNodeId + " creating new PATH on NODE #" + selNode);
                    nodeTraverse(newNodeTraceItem);
                };
            };
        };
    };


})();

