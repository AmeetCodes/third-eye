'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  sankey,
  sankeyLinkHorizontal,
  sankeyCenter,
  SankeyNode,
  SankeyLink
} from 'd3-sankey';

interface DataNode {
  name: string;
}

interface DataLink {
  source: number | string;
  target: number | string;
  value: number;
}

interface SankeyChartProps {
  data: {
    nodes: DataNode[];
    links: DataLink[];
  };
  width?: number;
  height?: number;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({ data, width = 800, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 160, bottom: 20, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sankeyGenerator = sankey<DataNode, DataLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [innerWidth - 1, innerHeight - 5]])
      .nodeAlign(sankeyCenter)
      .nodeId(d => d.name);

    const { nodes, links } = sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    });

    // Color scale
    // Brand color scale
    const brandColors = [
      '#B93654', '#0A3992', '#9e2c46', '#082f7a',
      '#ce4a6b', '#1e4aad', '#7d2038', '#3a65c7',
      '#d97706', '#16a34a'
    ];
    const color = d3.scaleOrdinal(brandColors);

    // Links
    const link = g.append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.2)
      .selectAll('g')
      .data(links)
      .join('g')
      .style('mix-blend-mode', 'multiply');

    link.append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => color(d.source.name))
      .attr('stroke-width', d => Math.max(1, d.width || 0));

    link.append('title')
      .text(d => `${(d.source as any).name} → ${(d.target as any).name}\n${d.value.toLocaleString()} Billion`);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    node.append('rect')
      .attr('x', d => d.x0 || 0)
      .attr('y', d => d.y0 || 0)
      .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', (d: any) => color(d.name))
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-width', 1)
      .attr('rx', 4);

    node.append('text')
      .attr('x', d => (d.x0 || 0) < innerWidth / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6)
      .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 || 0) < innerWidth / 2 ? 'start' : 'end')
      .text(d => d.name)
      .attr('fill', '#f8fafc')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('font-family', 'Inter, sans-serif');

    node.append('title')
      .text(d => `${d.name}\n${(d.value || 0).toLocaleString()} Billion`);

  }, [data, width, height]);

  return (
    <div className="w-full h-full overflow-hidden flex justify-center items-center p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 100%)' }}>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};
