import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ReferralTree = ({ userData }) => {
    const treeContainer = useRef(null);

    useEffect(() => {
        if (userData) {
            // Create a D3 tree layout
            const treeLayout = d3.tree().size([500, 500]);

            // Create a D3 hierarchy from the user data
            const root = d3.hierarchy(userData);

            // Assign parent-child relationships
            root.descendants().forEach((d, i) => {
                if (d.data.referrer_id) {
                    const parent = root.descendants().find(node => node.data.id === d.data.referrer_id);
                    if (parent) {
                        if (!parent.children) parent.children = [];
                        parent.children.push(d);
                    }
                }
            });

            // Update the tree layout with the hierarchy data
            treeLayout(root);

            // Create a D3 SVG element
            const svg = d3.select(treeContainer.current).append('svg')
                .attr('width', 600)
                .attr('height', 600);

            // Create links between nodes
            svg.selectAll('.link')
                .data(root.links())
                .enter().append('path')
                .attr('class', 'link')
                .attr('d', d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x));

            // Create nodes
            const nodes = svg.selectAll('.node')
                .data(root.descendants())
                .enter().append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.y},${d.x})`);

            nodes.append('circle')
                .attr('r', 4);

            nodes.append('text')
                .attr('dy', '0.31em')
                .attr('x', d => d.children ? -6 : 6)
                .attr('text-anchor', d => d.children ? 'end' : 'start')
                .text(d => d.data.name);
        }
    }, [userData]);

    return <div ref={treeContainer}></div>;
};

export default ReferralTree;
