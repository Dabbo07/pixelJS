(function() {

    var NodeTraversalService = function() {
    };

    NodeTraversalService.prototype.spiderTimeOut = 10000;
    NodeTraversalService.prototype.nodes = [];
    NodeTraversalService.prototype.nodeTree = [];

    NodeTraversalService.prototype.distanceCalc = function(sx, sy, ex, ey) {
        var deltaX = sx - ex;
        var deltaY = sy - ey;
        return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    };
    
    NodeTraversalService.prototype.getBestPath = function() {
        var bestPathId = -1;
        var bestDistance = -1;
        for (var i = 0; i < this.nodeTree.length; i++) {
            //console.log("NodeTree #" + i + " : " + this.nodeTree[i].nodes + ", Distance: " + this.nodeTree[i].totalDistance);
            if (this.nodeTree[i].success) {
                if (bestDistance === -1) {
                    bestPathId = i;
                    bestDistance = this.nodeTree[i].totalDistance;
                } else if (bestDistance > this.nodeTree[i].totalDistance) {
                    bestPathId = i;
                    bestDistance = this.nodeTree[i].totalDistance;
                };
            };
        };
        if (bestPathId > -1) {
            return this.nodeTree[bestPathId].nodes;
        };
        return [];
    };

    // Remove any connections that the current spider has already visited on thier generated path.
    NodeTraversalService.prototype.removeDuplicateNodes = function(foundPathNodes, currentNodeId) {
        var connectionsAvailable = this.nodes[currentNodeId].connections.slice();
        for (var i = 0; i < foundPathNodes.length; i++) {
            for (var a = 0; a < connectionsAvailable.length; a++) {
                if (foundPathNodes[i] === connectionsAvailable[a]) {
                    connectionsAvailable.splice(a, 1);
                };
            };
        };
        return connectionsAvailable;
    };
    
    NodeTraversalService.prototype.createSpiderNodeTrace = function(destinationConnection, spawnStartingNodes, startingDistance) {
        var newSpiderNodeTrace = {
            currentNodeId: destinationConnection,
            totalDistance: startingDistance,
            nodes: spawnStartingNodes.slice(),
            success: false
        };
        this.nodeTree.push(newSpiderNodeTrace);
        return newSpiderNodeTrace;
    };

    NodeTraversalService.prototype.spiderTraverseNode = function(spiderNodeTrace, targetNodeId) {
        this.spiderTimeOut--;
        if (this.spiderTimeOut <= 0) {
            console.log("Recursion time out reached.");
            return;
        };
    
        var connectionsAvailable = this.removeDuplicateNodes(spiderNodeTrace.nodes, spiderNodeTrace.currentNodeId);
    
        var lastConnection = connectionsAvailable.length - 1;
        for (var i = 0; i < connectionsAvailable.length; i++) {
    
            var destinationConnection = connectionsAvailable[i];
            var destinationNode = this.nodes[destinationConnection];
            var currentNode = this.nodes[spiderNodeTrace.currentNodeId];
            var spawnStartingNodes = spiderNodeTrace.nodes.slice();                          // COPY of current path, before any updates.

            var distance = this.distanceCalc(currentNode.x, currentNode.y, destinationNode.x, destinationNode.y);

            if (lastConnection === i) {
                // Use current spider.
                spiderNodeTrace.totalDistance = spiderNodeTrace.totalDistance + distance;
                spiderNodeTrace.currentNodeId = destinationConnection;
                spiderNodeTrace.nodes.push(destinationConnection);
                if (targetNodeId === destinationConnection) {
                    // Found target node, no more traversing node for this spider.
                    spiderNodeTrace.success = true;
                } else {
                    // Continue traversing nodes
                    this.spiderTraverseNode(spiderNodeTrace, targetNodeId);
                };
            } else {
                // Need to spawn a new spider to take the new branch
                var newSpiderNodeTrace = this.createSpiderNodeTrace(destinationConnection, spawnStartingNodes, spiderNodeTrace.totalDistance);
                newSpiderNodeTrace.totalDistance = newSpiderNodeTrace.totalDistance + distance;
                newSpiderNodeTrace.nodes.push(destinationConnection);
                if (targetNodeId === destinationConnection) {
                    // Found target node, no more traversing node for this spider.
                    newSpiderNodeTrace.success = true;
                } else {
                    // Start traversing nodes
                    this.spiderTraverseNode(newSpiderNodeTrace, targetNodeId);
                };
            };
    
        };
    };
    
    app.NodeTraversalService = new NodeTraversalService();

})();

