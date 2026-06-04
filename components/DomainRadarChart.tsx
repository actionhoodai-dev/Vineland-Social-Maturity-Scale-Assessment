'use client';

import { useMemo } from 'react';
import { CategoryCode, CATEGORY_NAMES, CATEGORY_CODES } from '@/types';

interface Props {
    domainTotals: Record<CategoryCode, number>;
    maxDomainTotals: Record<CategoryCode, number>;
}

export default function DomainRadarChart({ domainTotals, maxDomainTotals }: Props) {
    const width = 320;
    const height = 320;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 100;

    // 8 Domains in display order
    const domains = CATEGORY_CODES;
    const numPoints = domains.length;

    // Calculate coordinates for grid lines and labels
    const gridData = useMemo(() => {
        const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
        
        return levels.map(level => {
            const points = domains.map((_, i) => {
                const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
                const r = radius * level;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                return `${x},${y}`;
            });
            return points.join(' ');
        });
    }, [cx, cy, radius, numPoints, domains]);

    // Calculate axis lines
    const axes = useMemo(() => {
        return domains.map((domain, i) => {
            const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
            const x1 = cx;
            const y1 = cy;
            const x2 = cx + radius * Math.cos(angle);
            const y2 = cy + radius * Math.sin(angle);

            // Label coordinates (extended slightly further)
            const labelDist = radius + 22;
            let lx = cx + labelDist * Math.cos(angle);
            let ly = cy + labelDist * Math.sin(angle);

            // Adjust text anchors and offsets based on position
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (Math.cos(angle) > 0.1) {
                textAnchor = 'start';
                lx += 2;
            } else if (Math.cos(angle) < -0.1) {
                textAnchor = 'end';
                lx -= 2;
            }

            if (Math.sin(angle) > 0.8) {
                ly += 4;
            } else if (Math.sin(angle) < -0.8) {
                ly -= 4;
            }

            return { domain, x1, y1, x2, y2, lx, ly, textAnchor };
        });
    }, [cx, cy, radius, numPoints, domains]);

    // Calculate the actual performance polygon points
    const performancePoints = useMemo(() => {
        const points = domains.map((domain, i) => {
            const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
            const max = maxDomainTotals[domain] || 1;
            const actual = domainTotals[domain] || 0;
            const percentage = Math.min(1, Math.max(0, actual / max));
            const r = radius * percentage;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return { x, y, domain, actual, max, percentage };
        });

        const pathString = points.map(p => `${p.x},${p.y}`).join(' ');
        return { pathString, points };
    }, [domainTotals, maxDomainTotals, cx, cy, radius, numPoints, domains]);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white border border-[#D1D5DB] shadow-inner h-full min-h-[350px]">
            <h4 className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-[0.2em] mb-4">
                Adaptive Competence Profiler
            </h4>
            
            <div className="relative">
                <svg width={width} height={height} className="overflow-visible font-sans">
                    {/* Background Grid Polygons */}
                    {gridData.map((points, idx) => (
                        <polygon
                            key={idx}
                            points={points}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Concentric grid labels for percentages */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, idx) => (
                        <text
                            key={idx}
                            x={cx}
                            y={cy - radius * level + 3}
                            className="text-[8px] font-semibold text-[#9CA3AF] text-center"
                            textAnchor="middle"
                        >
                            {level * 100}%
                        </text>
                    ))}

                    {/* Axis Lines & Labels */}
                    {axes.map((axis, idx) => (
                        <g key={idx}>
                            <line
                                x1={axis.x1}
                                y1={axis.y1}
                                x2={axis.x2}
                                y2={axis.y2}
                                stroke="#D1D5DB"
                                strokeWidth={1}
                                strokeDasharray="3,3"
                            />
                            {/* Domain Abbreviation Label */}
                            <text
                                x={axis.lx}
                                y={axis.ly - 2}
                                textAnchor={axis.textAnchor}
                                className="text-[10px] font-extrabold text-[#1E3A8A] fill-[#1E3A8A] leading-none"
                            >
                                {axis.domain}
                            </text>
                            {/* Domain Subname Label */}
                            <text
                                x={axis.lx}
                                y={axis.ly + 6}
                                textAnchor={axis.textAnchor}
                                className="text-[7.5px] font-semibold text-gray-500 fill-gray-500 leading-none"
                            >
                                {CATEGORY_NAMES[axis.domain].split(' ')[0]}
                            </text>
                        </g>
                    ))}

                    {/* Performance Polygon */}
                    {performancePoints.pathString && (
                        <polygon
                            points={performancePoints.pathString}
                            fill="rgba(30, 58, 138, 0.15)"
                            stroke="#1E3A8A"
                            strokeWidth={2.5}
                            className="transition-all duration-500 ease-in-out"
                        />
                    )}

                    {/* Performance Vertices Circles */}
                    {performancePoints.points.map((p, idx) => (
                        <g key={idx} className="group cursor-pointer">
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={4.5}
                                fill="#1E3A8A"
                                stroke="#FFFFFF"
                                strokeWidth={1.5}
                                className="transition-all duration-300 group-hover:r-6 hover:scale-125"
                            />
                        </g>
                    ))}
                </svg>
            </div>
            
            <div className="mt-4 flex gap-4 text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-50 border border-[#1E3A8A] rounded-none inline-block"></span>
                    <span>Performance Area</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t border-[#D1D5DB] border-dashed inline-block"></span>
                    <span>Domain Max Norms</span>
                </div>
            </div>
        </div>
    );
}
