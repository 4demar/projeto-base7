import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { BannerTextElement } from '../../types';

interface PropertiesPanelProps {
  element: BannerTextElement | null;
  onChange: (updated: BannerTextElement) => void;
}

export default function PropertiesPanel({ element, onChange }: PropertiesPanelProps) {
  if (!element) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Selecione um elemento de texto
        </Typography>
      </Box>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...element, content: e.target.value });
  };

  const handleFontSizeSlider = (_: Event, value: number | number[]) => {
    onChange({ ...element, fontSize: value as number });
  };

  const handleFontSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value > 0) {
      onChange({ ...element, fontSize: value });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...element, color: e.target.value });
  };

  const handleFontWeightChange = (e: SelectChangeEvent) => {
    onChange({ ...element, fontWeight: e.target.value as 'normal' | 'bold' });
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h6">Propriedades</Typography>

      <TextField
        label="Conteúdo"
        value={element.content}
        onChange={handleContentChange}
        fullWidth
        multiline
        minRows={2}
      />

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Tamanho da Fonte
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider
            value={element.fontSize}
            onChange={handleFontSizeSlider}
            min={8}
            max={120}
            sx={{ flex: 1 }}
          />
          <TextField
            type="number"
            value={element.fontSize}
            onChange={handleFontSizeInput}
            slotProps={{ htmlInput: { min: 1, max: 200 } }}
            sx={{ width: 80 }}
            size="small"
          />
        </Box>
      </Box>

      <TextField
        label="Cor do Texto"
        type="color"
        value={element.color}
        onChange={handleColorChange}
        fullWidth
        slotProps={{
          htmlInput: { style: { height: 40, cursor: 'pointer' } },
        }}
      />

      <FormControl fullWidth>
        <InputLabel id="font-weight-label">Peso da Fonte</InputLabel>
        <Select
          labelId="font-weight-label"
          value={element.fontWeight}
          label="Peso da Fonte"
          onChange={handleFontWeightChange}
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Negrito</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
