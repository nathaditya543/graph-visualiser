
import { Stage, Layer, Circle, Text, Line} from 'react-konva';
import { React, useState, useEffect, useRef } from 'react';

const DemoCanvas = () => {
    const stageRef = useRef();
    const divRef = useRef(null);
    const[ nodes, setNodes ]= useState([]);
    const[ edges, setEdges ] = useState([]);
    const[ conn,setConn] = useState([0,0,0,0]);
    const[ nodeId, setNodeId ] = useState(0);
    const[dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    });

  
    useEffect(() => {
      if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
        setDimensions({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight
        })
      }
    }, []);

    const cantorFunc = (a,b) => {
        var sum = a+b;
        sum = ((sum*sum+1)/2) + b;
        return sum;
    };

    const clickHandler = (e) => {
        var x_clk = e.evt.layerX;
        var y_clk = e.evt.layerY;
        console.log("Click handler");
        console.log(`Clicked at x: ${x_clk}, y: ${y_clk}`);

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
    }

    const handleSingleClick = (e) =>{
        if(conn[0] === 0){
            nodes.map((shape) => {
                if(shape.id === e.target.attrs.id)
                    shape.fill = 'grey';
            });
            setConn([conn[0]^1, e.target.attrs.id, e.target.attrs.x, e.target.attrs.y]);
        }
        else{
            const newEdge = {
                id: cantorFunc(conn[1], e.target.attrs.id),
                points: [conn[2],conn[3], e.target.attrs.x,e.target.attrs.y],
                parents:[conn[1], e.target.attrs.id]
            };
            const updatedEdges = [...edges, newEdge];
            setEdges(updatedEdges);
            
            nodes.map((shape) => {
                if(shape.id === conn[1])
                    shape.fill = 'orange';
            });
            
            setConn([conn[0]^1, 0, 0, 0]);
        }
        e.cancelBubble = true;
    }
    
    const handleDoubleclick = (e) => {
        const clickedCircleId = e.target.attrs.id;
        const updatedItems = nodes.filter((item) => item.id !== clickedCircleId);
        setNodes(updatedItems);
        
        const updatedEdges = edges.filter((edge) => edge.parents[0] !== clickedCircleId && edge.parents[1] !== clickedCircleId);
        setEdges(updatedEdges);
        setConn([0, 0, 0, 0]);
        console.log("Double Click handler");
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
                />  
                )}
                {nodes.map((shape) =>
                <>
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
                </>
                )}
                </>
            </Layer>
        </Stage>
        <button onClick={clearAll} style={{margin:"10px"}}>Clear All</button>
    </div>
  );
};

export default DemoCanvas;
