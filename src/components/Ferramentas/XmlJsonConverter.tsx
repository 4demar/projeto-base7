import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Paper, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from './copyToClipboard';

export default function XmlJsonConverter() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'xml2json' | 'json2xml'>('xml2json');
    let output = '';
    try {
        if (mode === 'xml2json' && input) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(input, 'text/xml');
            const xmlToObj = (node: Element): Record<string, unknown> => {
                if (node.children.length === 0) return { [node.tagName]: node.textContent };
                const children: Record<string, unknown[]> = {};
                Array.from(node.children).forEach(child => {
                    if (!children[child.tagName]) children[child.tagName] = [];
                    children[child.tagName].push(child.children.length === 0 ? child.textContent : xmlToObj(child)[child.tagName]);
                });
                const obj: Record<string, unknown> = {};
                Object.entries(children).forEach(([k, v]) => { obj[k] = v.length === 1 ? v[0] : v; });
                return { [node.tagName]: obj };
            };
            output = JSON.stringify(xmlToObj(doc.documentElement), null, 2);
        } else if (mode === 'json2xml' && input) {
            const obj = JSON.parse(input);
            const toXml = (o: unknown, tag?: string): string => {
                if (typeof o !== 'object' || o === null) return tag ? `<${tag}>${o}</${tag}>` : String(o);
                return Object.entries(o as Record<string, unknown>).map(([k, v]) => {
                    if (Array.isArray(v)) return v.map(i => toXml(i, k)).join('\n');
                    return `<${k}>${typeof v === 'object' ? '\n' + toXml(v) + '\n' : v}</${k}>`;
                }).join('\n');
            };
            output = toXml(obj);
        }
    } catch { output = 'Erro na conversão'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>XML ⇄ JSON</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant={mode === 'xml2json' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('xml2json')}>XML → JSON</Button>
                <Button variant={mode === 'json2xml' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('json2xml')}>JSON → XML</Button>
            </Box>
            <TextField fullWidth multiline rows={6} size="small" label="Entrada" value={input} onChange={(e) => setInput(e.target.value)} sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 12 } }} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', position: 'relative', overflow: 'auto', maxHeight: 250 }}>
                {output || '—'}
                {output && output !== 'Erro na conversão' && (
                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                )}
            </Paper>
        </CardContent></Card>
    );
}
