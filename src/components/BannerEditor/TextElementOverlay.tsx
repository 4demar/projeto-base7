import { useCallback, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import type { BannerTextElement } from '../../types';

interface TextElementOverlayProps {
  element: BannerTextElement;
  selected: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function TextElementOverlay({
  element,
  selected,
  containerRef,
  onSelect,
  onMove,
}: TextElementOverlayProps) {
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clamp(((e.clientX - rect.left - offsetRef.current.x) / rect.width) * 100, 0, 100);
      const y = clamp(((e.clientY - rect.top - offsetRef.current.y) / rect.height) * 100, 0, 100);
      onMove(element.id, x, y);
    },
    [containerRef, element.id, onMove],
  );

  const handleMouseUp = useCallback(() => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(element.id);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const elXPx = (element.x / 100) * rect.width;
    const elYPx = (element.y / 100) * rect.height;
    offsetRef.current = {
      x: e.clientX - rect.left - elXPx,
      y: e.clientY - rect.top - elYPx,
    };

    draggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Box
      onMouseDown={handleMouseDown}
      sx={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        fontWeight: element.fontWeight,
        cursor: 'move',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        outline: selected ? '2px solid #6C63FF' : 'none',
        outlineOffset: 2,
        borderRadius: '4px',
        px: 0.5,
        '&:hover': {
          outline: selected ? '2px solid #6C63FF' : '1px solid #8B949E',
        },
      }}
    >
      {element.content}
    </Box>
  );
}
