
import { Stage, Layer, Circle, Text, Line} from 'react-konva';
import { React, useState, useEffect, useRef } from 'react';

const DemoCanvas = () => {
    const stageRef = useRef();
    const divRef = useRef(null);
    const[ nodes, setNodes ]= useState([]);
    const[ edges, setEdges ] = useState([]);
    const[ conn,setConn] = useState([0,0,0,0]);
    const [ nodeId, setNodeId ] = useState(0);
    const [dimensions, setDimensions] = useState({
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
    }, [])

    const clickHandler = (e) => {
        var x_clk = e.evt.layerX;
        var y_clk = e.evt.layerY;
        console.log("Click handler");
        console.log(`Clicked at x: ${x_clk}, y: ${y_clk}`);

        const newCircle = {
            key: nodeId.toString(),
            x: x_clk,
            y: y_clk,
            radius: 20,
            fill: 'orange',
        };
        const updatedItems = [...nodes, newCircle];
        setNodeId(nodeId+1);
        setNodes(updatedItems);
    }

    const handleDoubleclick = (e) => {
        const clickedCircleId = e.target.attrs.id;
        const updatedItems = nodes.filter((item) => item.key !== clickedCircleId);
        setNodes(updatedItems);
        console.log("Double Click handler");
    };

    const handleSingleClick = (e) =>{
        if(conn[0] === 0){
        nodes.map((shape) => {
            if(shape.key === e.target.attrs.id)
                shape.fill = 'grey';
            });
            setConn([conn[0]^1, e.target.attrs.id, e.target.attrs.x, e.target.attrs.y]);
        }
        else{
            const newEdge = {
                points: [conn[2],conn[3], e.target.attrs.x,e.target.attrs.y]
            };

            const updatedItems = [...edges, newEdge];
            setEdges(updatedItems);
            nodes.map((shape) => {
                if(shape.key === conn[1])
                    shape.fill = 'orange';
            });
            setConn([conn[0]^1, 0, 0, 0]);
        }
        e.cancelBubble = true;
    }
    
    const clearAll = () => {
        setNodes([]);
        setNodeId(0);
    }


    useEffect(() => {
        console.log(nodes);
        console.log(conn);
    })


  return (
    <div ref={divRef}>
        <Stage width={dimensions.width} height={600} ref={stageRef} onClick={clickHandler} style={{border: "2px solid black", margin:"10px"}}>
            <Layer>
                {nodes.map((shape) =>
                <>
                    <Circle
                        id = {shape.key}
                        x = {shape.x}
                        y = {shape.y}
                        fill = {shape.fill}
                        radius={shape.radius}
                        stroke={"black"}
                        onClick={handleSingleClick}
                        onDblClick={handleDoubleclick}
                    />
                    <Text
                        id = {shape.key}
                        x = {shape.x - 4}
                        y = {shape.y - 4}
                        text={shape.key}
                        fontSize={12}
                        fill="black"
                        onClick={handleSingleClick}
                        onDblClick={handleDoubleclick}
                    />
                </>
                )}
            </Layer>
        </Stage>
        <button onClick={clearAll} style={{margin:"10px"}}>Clear All</button>
    </div>
  );
};

export default DemoCanvas;
