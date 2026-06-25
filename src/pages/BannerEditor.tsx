import { useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloudUpload from '@mui/icons-material/CloudUpload';
import TextFields from '@mui/icons-material/TextFields';
import Code from '@mui/icons-material/Code';
import Save from '@mui/icons-material/Save';
import FolderOpen from '@mui/icons-material/FolderOpen';
import Delete from '@mui/icons-material/Delete';
import BannerCanvas from '../components/BannerEditor/BannerCanvas';
import PropertiesPanel from '../components/BannerEditor/PropertiesPanel';
import HtmlCodeDialog from '../components/BannerEditor/HtmlCodeDialog';
import ProjectsListDialog from '../components/BannerEditor/ProjectsListDialog';
import { generateHtml } from '../components/BannerEditor/generateHtml';
import { useBannerEditor } from '../hook/useStore';
import type { BannerTextElement } from '../types';

const VALID_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function BannerEditor() {
  const { projects, saveProject, loadProject, deleteProject } = useBannerEditor();

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<BannerTextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false);
  const [projectsDialogOpen, setProjectsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = textElements.find((el) => el.id === selectedElementId) ?? null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_MIME_TYPES.includes(file.type)) {
      setSnackbar({ open: true, message: 'Formato inválido. Use PNG, JPG, JPEG ou WebP.' });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddText = () => {
    const newElement: BannerTextElement = {
      id: crypto.randomUUID(),
      content: 'Novo Texto',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: 'normal',
    };
    setTextElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleRemoveText = () => {
    if (!selectedElementId) return;
    setTextElements((prev) => prev.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const handleSelectElement = (id: string) => {
    setSelectedElementId(id);
  };

  const handleMoveElement = useCallback((id: string, x: number, y: number) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  }, []);

  const handleElementChange = (updated: BannerTextElement) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === updated.id ? updated : el))
    );
  };

  const handleViewHtml = () => {
    setHtmlDialogOpen(true);
  };

  const handleSaveProject = () => {
    const name = window.prompt('Nome do projeto:');
    if (!name) return;
    saveProject({
      name,
      backgroundImage: backgroundImage ?? '',
      textElements,
    });
  };

  const handleLoadProject = (id: string) => {
    const project = loadProject(id);
    if (project) {
      setBackgroundImage(project.backgroundImage || null);
      setTextElements(project.textElements);
      setSelectedElementId(null);
    }
    setProjectsDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const htmlCode = backgroundImage ? generateHtml(backgroundImage, textElements) : '';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Editor de Layout de Banner
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          hidden
          onChange={handleFileChange}
        />
        <Button variant="contained" startIcon={<CloudUpload />} onClick={handleUploadClick}>
          Upload Imagem
        </Button>
        <Button variant="contained" startIcon={<TextFields />} onClick={handleAddText}>
          Adicionar Texto
        </Button>
        <Button
          variant="contained"
          startIcon={<Delete />}
          onClick={handleRemoveText}
          disabled={!selectedElementId}
        >
          Remover Texto
        </Button>
        <Button
          variant="contained"
          startIcon={<Code />}
          onClick={handleViewHtml}
          disabled={!backgroundImage}
        >
          Ver Código HTML
        </Button>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveProject}>
          Salvar Projeto
        </Button>
        <Button variant="contained" startIcon={<FolderOpen />} onClick={() => setProjectsDialogOpen(true)}>
          Projetos
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <BannerCanvas
            backgroundImage={backgroundImage}
            textElements={textElements}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
            onMoveElement={handleMoveElement}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PropertiesPanel element={selectedElement} onChange={handleElementChange} />
        </Grid>
      </Grid>

      <HtmlCodeDialog
        open={htmlDialogOpen}
        onClose={() => setHtmlDialogOpen(false)}
        htmlCode={htmlCode}
      />

      <ProjectsListDialog
        open={projectsDialogOpen}
        onClose={() => setProjectsDialogOpen(false)}
        projects={projects}
        onLoad={handleLoadProject}
        onDelete={deleteProject}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
