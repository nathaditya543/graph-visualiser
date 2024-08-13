
import { Stage, Layer, Circle, Text, Line, Group} from 'react-konva';
import { React, useState, useEffect, useRef, useCallback } from 'react';

const DemoCanvas = () => {
    const stageRef = useRef();
    const divRef = useRef(null);
    const[ nodes, setNodes ]= useState([]);
    const[ edges, setEdges ] = useState([]);
    const[ conn,setConn] = useState([0,0,0,0]);
    const[ nodeId, setNodeId ] = useState(0);
    const[ graph, setGraph ] = useState({})
    const[ dimensions, setDimensions ] = useState({
        width: 0,
        height: 0
    });

  
    useEffect(() => { //responsive stage dimensions, the tag only accepts dimensions in pixels, so cannot use the % unit.
      if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
        setDimensions({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight
        })
      }
    }, []);

    const cantorFunc = useCallback((a,b) => { //pairing function to generate unique ids for the edges
        a = Number(a);
        b = Number(b);
        if(a < b){
            a = a^b;
            b = a^b;
            a = a^b;
        }
        var sum = a+b;
        sum = ((sum * (sum +1))/2) + b;
        return sum.toString();
    }, []);

    const clickHandler = useCallback((e) => {
        var x_clk = e.evt.layerX;
        var y_clk = e.evt.layerY;
        const newCircle = {
            id: nodeId.toString(),
            x: x_clk,
            y: y_clk,
            radius: 20,
            fill: 'orange',
        };
        const updatedItems = [...nodes, newCircle];
        setNodeId(nodeId+1);
        setNodes(updatedItems);

        const updatedGraph = graph;
        updatedGraph[newCircle.id] = [];
        setGraph(updatedGraph);

        
        const node = nodes.find((node) => node.id === conn[1]);
        if(node)
            node.fill = 'orange';
        setConn([0, 0, 0, 0]);
    }, [conn, graph, nodes, nodeId]);

    const handleSingleClick = useCallback((e) => {
        
        const parent = e.target.getClassName();
        var x = e.target.parent.attrs.x;
        var y = e.target.parent.attrs.y;
        if(parent === "Text"){
            x = x + 4;
            y = y + 4;
        }

        if(conn[0] === 0){ 
            const node = nodes.find((node) => node.id === e.target.attrs.id);
            if(node)
                node.fill = 'grey';
            setConn([conn[0]^1, e.target.attrs.id, x, y]);
        }
    
        else{ 
            const newEdge = {
                id: cantorFunc(conn[1], e.target.attrs.id),
                points: [conn[2],conn[3], x, y],
                parents:[conn[1], e.target.attrs.id]
            };

            const flag = edges.find((edge) => edge.id === newEdge.id);

            if(!flag){
                const updatedEdges = [...edges, newEdge];
                setEdges(updatedEdges);

                const updatedGraph = graph;
                updatedGraph[e.target.attrs.id].push(conn[1]);
                updatedGraph[conn[1]].push(e.target.attrs.id);
            }

            const node = nodes.find((node) => node.id === conn[1]);
            if(node)
                node.fill = 'orange';
            setConn([0, 0, 0, 0]);
        }
        e.cancelBubble = true;
    }, [conn, edges, graph, nodes, cantorFunc]);
    
    const handleDoubleclick = useCallback((e) => {
        const clickedCircleId = e.target.attrs.id;
        const updatedNodes = nodes.filter((node) => node.id !== clickedCircleId);
        setNodes(updatedNodes);
        
        const updatedEdges = edges.filter((edge) => edge.parents[0] !== clickedCircleId && edge.parents[1] !== clickedCircleId);
        setEdges(updatedEdges);
        
        setConn([0, 0, 0, 0]);

        const updatedGraph = graph;
        updatedGraph[clickedCircleId].forEach(node => {
            updatedGraph[node] = updatedGraph[node].filter(id => id !== clickedCircleId);
        });
        delete updatedGraph[clickedCircleId];
        setGraph(updatedGraph);
    }, [nodes, edges, graph]);

    const handleSingleClickEdge = (e) => {
        e.cancelBubble = true;
    };

    const handleDoubleClickEdge = useCallback((e) =>{
        const clickedEdgeId = e.target.attrs.id;
        const updatedItems = edges.filter((edge) => edge.id !== clickedEdgeId);
        setEdges(updatedItems);

        const edge = edges.find((edge) => edge.id === clickedEdgeId);
        const updatedGraph = graph;
        const parents = edge.parents;
        updatedGraph[parents[0]] = updatedGraph[parents[0]].filter(id => id !== parents[1]); 
        updatedGraph[parents[1]] = updatedGraph[parents[1]].filter(id => id !== parents[0]); 
        setGraph(updatedGraph);
        
        e.cancelBubble = true;
    }, [edges, graph]);
    
    const handleDragEnd = (e) => {
        var updatedNodes = [...nodes];
        updatedNodes = updatedNodes.map(node => {
            if (node.id === e.target.attrs.id) {
                node.x = e.target.attrs.x;
                node.y = e.target.attrs.y;
            }
            return node;
        });
        setNodes(updatedNodes);
    }

    const handleDragMove = (e) => {
        var updatedEdges = edges.map((edge) => {
            if(edge.parents[0] === e.target.attrs.id){
                edge.points = [e.target.attrs.x, e.target.attrs.y, edge.points[2], edge.points[3]];
            }
            else if(edge.parents[1] === e.target.attrs.id){
                edge.points = [ edge.points[0], edge.points[1], e.target.attrs.x, e.target.attrs.y];
            }
            return edge;
        })
        setEdges(updatedEdges);
    }

    const handleDragStart = (e) => {

    }

    const clearAll = () => {
        setEdges([]);
        setNodes([]);
        setNodeId(0);
        setConn([0,0,0,0]);
        setGraph({});
    }

  return (
    <div ref={divRef}>
        <Stage width={dimensions.width} height={600} ref={stageRef} onClick={clickHandler} style={{border: "2px solid black", margin:"10px"}}>
            <Layer>
                <>
                    {edges.map((edge) => 
                    <Line
                        id={edge.id}
                        points={edge.points}
                        stroke={"black"}
                        strokeWidth={4}
                        onDblClick={handleDoubleClickEdge}
                        onClick={handleSingleClickEdge}
                    />)}

                    {nodes.map((node) =>
                    <Group
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onClick={handleSingleClick}
                        onDblClick={handleDoubleclick}
                        draggable
                        key={node.id}
                        id={node.id}
                        x = {node.x}
                        y = {node.y}

                    >
                        <Circle
                            id = {node.id}
                            fill = {node.fill}
                            radius={node.radius}
                            stroke={"black"}
                        />
                        <Text
                            id = {node.id}
                            align='top'
                            text={node.id}
                            fontSize={12}
                            fill="black"
                        />
                    </Group>
                    )}
                </>
            </Layer>
        </Stage>
        <button onClick={clearAll} style={{margin:"10px"}}>Clear All</button>
        <div>
            <h3>Graph Object:</h3>
            <pre>{JSON.stringify(graph, null, 2)}</pre>
        </div>
    </div>
  );
};

export default DemoCanvas;
