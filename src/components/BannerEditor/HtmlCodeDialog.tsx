import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

interface HtmlCodeDialogProps {
  open: boolean;
  onClose: () => void;
  htmlCode: string;
}

export default function HtmlCodeDialog({ open, onClose, htmlCode }: HtmlCodeDialogProps) {
  const [snackbar, setSnackbar] = useState<{ open: boolean; severity: 'success' | 'error'; message: string }>({
    open: false,
    severity: 'success',
    message: '',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setSnackbar({ open: true, severity: 'success', message: 'Código copiado com sucesso' });
    } catch {
      setSnackbar({ open: true, severity: 'error', message: 'Falha ao copiar código' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Código HTML</DialogTitle>
        <DialogContent>
          <Box
            component="pre"
            sx={{
              bgcolor: '#0d1117',
              color: '#e6edf3',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 400,
              fontFamily: 'monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              m: 0,
            }}
          >
            <code>{htmlCode}</code>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy} variant="contained">
            Copiar Código
          </Button>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
