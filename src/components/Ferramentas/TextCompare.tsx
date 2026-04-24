import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function TextCompare() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Comparação de Textos</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth multiline rows={6} size="small" label="Texto 1" value={text1} onChange={(e) => setText1(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth multiline rows={6} size="small" label="Texto 2" value={text2} onChange={(e) => setText2(e.target.value)} />
                </Grid>
            </Grid>
            {text1 && text2 && (
                <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 12 }}>
                    {Array.from({ length: maxLines }).map((_, i) => {
                        const l1 = lines1[i] || '';
                        const l2 = lines2[i] || '';
                        const same = l1 === l2;
                        return (
                            <Box key={i} sx={{ display: 'flex', gap: 1, bgcolor: same ? 'transparent' : 'rgba(255,107,107,0.1)', px: 1, borderRadius: 1, mb: 0.5 }}>
                                <Typography variant="caption" sx={{ width: 30, color: 'text.secondary' }}>{i + 1}</Typography>
                                <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace', fontSize: 12, color: same ? 'text.primary' : '#FF6B6B' }}>{l1 || '(vazio)'}</Typography>
                                <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace', fontSize: 12, color: same ? 'text.primary' : '#00BFA6' }}>{l2 || '(vazio)'}</Typography>
                            </Box>
                        );
                    })}
                </Paper>
            )}
        </CardContent></Card>
    );
}
