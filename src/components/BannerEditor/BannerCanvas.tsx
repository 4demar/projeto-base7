import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { BannerTextElement } from '../../types';
import TextElementOverlay from './TextElementOverlay';

interface BannerCanvasProps {
  backgroundImage: string | null;
  textElements: BannerTextElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onMoveElement: (id: string, x: number, y: number) => void;
}

export default function BannerCanvas({
  backgroundImage,
  textElements,
  selectedElementId,
  onSelectElement,
  onMoveElement,
}: BannerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!backgroundImage) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Faça upload de uma imagem para começar
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        lineHeight: 0,
      }}
    >
      <Box
        component="img"
        src={backgroundImage}
        alt="Banner background"
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
      {textElements.map((element) => (
        <TextElementOverlay
          key={element.id}
          element={element}
          selected={element.id === selectedElementId}
          containerRef={containerRef}
          onSelect={onSelectElement}
          onMove={onMoveElement}
        />
      ))}
    </Box>
  );
}
