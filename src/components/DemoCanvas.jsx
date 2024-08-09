
import { Stage, Layer, Circle, Text, Line} from 'react-konva';
import { React, useState, useEffect, useRef } from 'react';

const DemoCanvas = () => {
    const stageRef = useRef();
    const divRef = useRef(null);
    const[ nodes, setNodes ]= useState([]);
    const[ edges, setEdges ] = useState([]);
    const[ conn,setConn] = useState([0,0,0,0]);
    const[ nodeId, setNodeId ] = useState(0);
    const[ graph, setGraph ] = useState(({}))
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

    const cantorFunc = (a,b) => { //pairing function to generate unique ids for the edges
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
    };

    const clickHandler = (e) => {
        var x_clk = e.evt.layerX;
        var y_clk = e.evt.layerY;

        //create new node and add it.
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

        const updatedGrpah = graph;
        updatedGrpah[newCircle.id] = [];
        setGraph(updatedGrpah);

        //if a node was selected, unselect it.
        const shape = nodes.find((shape) => shape.id === conn[1]);
        if(shape)
            shape.fill = 'orange';
        setConn([0, 0, 0, 0]);
    }

    const handleSingleClick = (e) => {
        //get info about event
        const parent = e.target.getClassName();
        var x = e.target.attrs.x;
        var y = e.target.attrs.y;
        if(parent === "Text"){// compensate for offset of Text elements
            x = x + 4;
            y = y + 4;
        }

        //check if a node is already selccted or not
        //no node selected, prep the connection array.
        if(conn[0] === 0){ 
            const shape = nodes.find((shape) => shape.id === e.target.attrs.id);
            if(shape)
                shape.fill = 'grey';
            setConn([conn[0]^1, e.target.attrs.id, x, y]);
        }
        //a node has been selected, add an edge now using info in connectio array.
        else{ 
            const newEdge = {
                id: cantorFunc(conn[1], e.target.attrs.id),
                points: [conn[2],conn[3], x, y],
                parents:[conn[1], e.target.attrs.id]
            };

            //check if the edge alread exists.
            const flag = edges.find((edge) => edge.id === newEdge.id);

            //if the edge does not alr exist add it!
            if(!flag){
                const updatedEdges = [...edges, newEdge];
                setEdges(updatedEdges);

                const updatedGraph = graph;
                updatedGraph[e.target.attrs.id].push(conn[1]);
                updatedGraph[conn[1]].push(e.target.attrs.id);
            }
            
            //reset connection array and change the selected node's fill.
            const shape = nodes.find((shape) => shape.id === conn[1]);
            if(shape)
                shape.fill = 'orange';
            setConn([0, 0, 0, 0]);
        }
        //we do not want this event propagating to the stage level.
        e.cancelBubble = true;
    }
    
    const handleDoubleclick = (e) => {
        const clickedCircleId = e.target.attrs.id;
        const updatedItems = nodes.filter((node) => node.id !== clickedCircleId);
        setNodes(updatedItems);
        
        const updatedEdges = edges.filter((edge) => edge.parents[0] !== clickedCircleId && edge.parents[1] !== clickedCircleId);
        setEdges(updatedEdges);
        setConn([0, 0, 0, 0]);

        const updatedGraph = graph;
        updatedGraph[clickedCircleId].forEach(node => {
            updatedGraph[node] = updatedGraph[node].filter(id => id !== clickedCircleId);
        });
        delete updatedGraph[clickedCircleId];
        setGraph(updatedGraph);

    };

    const handleSingleClickEdge = (e) => {
        e.cancelBubble = true;
    };

    const handleDoubleClickEdge = (e) =>{
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
    };


    const clearAll = () => {
        setEdges([]);
        setNodes([]);
        setNodeId(0);
        setConn([0,0,0,0]);
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
                    
                    {nodes.map((shape) => <>
                        <Circle
                            id = {shape.id}
                            x = {shape.x}
                            y = {shape.y}
                            fill = {shape.fill}
                            radius={shape.radius}
                            stroke={"black"}
                            onClick={handleSingleClick}
                            onDblClick={handleDoubleclick}
                        />
                        <Text
                            id = {shape.id}
                            x = {shape.x - 4}
                            y = {shape.y - 4}
                            text={shape.id}
                            fontSize={12}
                            fill="black"
                            onClick={handleSingleClick}
                            onDblClick={handleDoubleclick}
                        />
                    </>)}
                </>
            </Layer>
        </Stage>
        <button onClick={clearAll} style={{margin:"10px"}}>Clear All</button>
    </div>
  );
};

export default DemoCanvas;
