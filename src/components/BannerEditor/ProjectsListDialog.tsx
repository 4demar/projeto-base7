import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Delete from '@mui/icons-material/Delete';
import type { BannerProject } from '../../types';

interface ProjectsListDialogProps {
  open: boolean;
  onClose: () => void;
  projects: BannerProject[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectsListDialog({ open, onClose, projects, onLoad, onDelete }: ProjectsListDialogProps) {
  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este projeto?');
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Projetos Salvos</DialogTitle>
      <DialogContent>
        {projects.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            Nenhum projeto salvo
          </Typography>
        ) : (
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="excluir" onClick={() => handleDelete(project.id)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText primary={project.name} />
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => onLoad(project.id)}
                >
                  Carregar
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
