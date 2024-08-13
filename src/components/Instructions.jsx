import React from 'react'

export default function Instructions() {
  return (<div style={{margin:"1rem"}}>
    <h1>Instructions</h1>
    <div><ul>
        <li>The rectangle above is your canvas!</li>
        <li>Single click/tap anywhere on the canvas to add a node</li>
        <li>Click on one node then another to create an undirected edge between them</li>
        <li>Double click/tap on either an edge or a node to delete it from the graph</li>
        <li>The nodes can be dragged to rearrange the graph!</li>
    </ul></div>
  </div>)
}
