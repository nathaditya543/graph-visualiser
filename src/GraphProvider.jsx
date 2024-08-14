import React, { createContext, useState } from 'react';

// Create the GraphContext
export const GraphContext = createContext();

// Create a provider component
export const GraphProvider = ({ children }) => {
  const [graph, setGraph] = useState({}); // Initial state for the graph
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  return (
    <GraphContext.Provider value={{ graph, setGraph, nodes, setNodes, edges, setEdges }}>
      {children}
    </GraphContext.Provider>
  );
};