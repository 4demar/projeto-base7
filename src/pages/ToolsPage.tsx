import { useState } from 'react';
import {
    Box, Typography, Tabs, Tab, Card, CardContent, TextField, Button,
    Select, MenuItem, FormControl, InputLabel, Paper, IconButton, Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ContentCopy } from '@mui/icons-material';

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

function NumberConverter() {
    const [input, setInput] = useState('');
    const [base, setBase] = useState<'dec' | 'hex' | 'bin'>('dec');
    const parse = (v: string, b: 'dec' | 'hex' | 'bin') => {
        try { return parseInt(v, b === 'dec' ? 10 : b === 'hex' ? 16 : 2); } catch { return NaN; }
    };
    const num = parse(input, base);
    const results = isNaN(num) ? { dec: '', hex: '', bin: '' } : { dec: num.toString(10), hex: num.toString(16).toUpperCase(), bin: num.toString(2) };
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Decimal ⇄ Hexadecimal ⇄ Binário</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Base</InputLabel>
                        <Select value={base} label="Base" onChange={(e) => setBase(e.target.value as 'dec' | 'hex' | 'bin')}>
                            <MenuItem value="dec">Decimal</MenuItem><MenuItem value="hex">Hexadecimal</MenuItem><MenuItem value="bin">Binário</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 8 }}>
                    <TextField fullWidth size="small" label="Valor" value={input} onChange={(e) => setInput(e.target.value)} />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {(['dec', 'hex', 'bin'] as const).filter(b => b !== base).map(b => (
                    <Paper key={b} sx={{ p: 1.5, flex: 1, minWidth: 150 }}>
                        <Typography variant="caption" color="text.secondary">{b === 'dec' ? 'Decimal' : b === 'hex' ? 'Hex' : 'Binário'}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{results[b] || '—'}</Typography>
                            {results[b] && <IconButton size="small" onClick={() => copyToClipboard(results[b])}><ContentCopy fontSize="small" /></IconButton>}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </CardContent></Card>
    );
}

function TimestampConverter() {
    const [ts, setTs] = useState('');
    const [dt, setDt] = useState('');
    const tsToDate = ts ? new Date(Number(ts) * (ts.length > 10 ? 1 : 1000)).toISOString() : '';
    const dateToTs = dt ? Math.floor(new Date(dt).getTime() / 1000).toString() : '';
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Timestamp ⇄ DateTime</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth size="small" label="Timestamp (Unix)" value={ts} onChange={(e) => setTs(e.target.value)} />
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>{tsToDate || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth size="small" label="DateTime (ISO)" value={dt} onChange={(e) => setDt(e.target.value)} placeholder="2024-01-01T00:00:00Z" />
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>{dateToTs || '—'}</Typography>
                </Grid>
            </Grid>
        </CardContent></Card>
    );
}

function Base64Tool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    let output = '';
    try { output = mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))); } catch { output = 'Erro na conversão'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Base64 Encode/Decode</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant={mode === 'encode' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('encode')}>Encode</Button>
                <Button variant={mode === 'decode' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('decode')}>Decode</Button>
            </Box>
            <TextField fullWidth multiline rows={3} size="small" label="Entrada" value={input} onChange={(e) => setInput(e.target.value)} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', position: 'relative' }}>
                {output || '—'}
                {output && output !== 'Erro na conversão' && (
                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                )}
            </Paper>
        </CardContent></Card>
    );
}

function UrlEncodeTool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    let output = '';
    try { output = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input); } catch { output = 'Erro na conversão'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>URL Encode/Decode</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant={mode === 'encode' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('encode')}>Encode</Button>
                <Button variant={mode === 'decode' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('decode')}>Decode</Button>
            </Box>
            <TextField fullWidth multiline rows={3} size="small" label="Entrada" value={input} onChange={(e) => setInput(e.target.value)} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', position: 'relative' }}>
                {output || '—'}
                {output && output !== 'Erro na conversão' && (
                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                )}
            </Paper>
        </CardContent></Card>
    );
}

function JsonFormatter() {
    const [input, setInput] = useState('');
    let output = '';
    try { output = JSON.stringify(JSON.parse(input), null, 2); } catch { output = input ? 'JSON inválido' : ''; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>JSON Formatter</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth multiline rows={8} size="small" label="JSON" value={input} onChange={(e) => setInput(e.target.value)} sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 12 } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, minHeight: 200, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all', position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                        {output || '—'}
                        {output && output !== 'JSON inválido' && (
                            <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </CardContent></Card>
    );
}

function JsonCsvConverter() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'json2csv' | 'csv2json'>('json2csv');
    let output = '';
    try {
        if (mode === 'json2csv' && input) {
            const arr = JSON.parse(input);
            if (Array.isArray(arr) && arr.length > 0) {
                const headers = Object.keys(arr[0]);
                output = [headers.join(','), ...arr.map((row: Record<string, unknown>) => headers.map(h => `"${String(row[h] ?? '')}"`).join(','))].join('\n');
            }
        } else if (mode === 'csv2json' && input) {
            const lines = input.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const result = lines.slice(1).map(line => {
                const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                return Object.fromEntries(headers.map((h, i) => [h, vals[i] || '']));
            });
            output = JSON.stringify(result, null, 2);
        }
    } catch { output = 'Erro na conversão'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>JSON ⇄ CSV</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button variant={mode === 'json2csv' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('json2csv')}>JSON → CSV</Button>
                <Button variant={mode === 'csv2json' ? 'contained' : 'outlined'} size="small" onClick={() => setMode('csv2json')}>CSV → JSON</Button>
            </Box>
            <TextField fullWidth multiline rows={6} size="small" label="Entrada" value={input} onChange={(e) => setInput(e.target.value)} sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 12 } }} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all', position: 'relative', overflow: 'auto', maxHeight: 250 }}>
                {output || '—'}
                {output && output !== 'Erro na conversão' && (
                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={() => copyToClipboard(output)}><ContentCopy fontSize="small" /></IconButton>
                )}
            </Paper>
        </CardContent></Card>
    );
}

function JwtDecoder() {
    const [token, setToken] = useState('');
    let header = '', payload = '';
    try {
        if (token) {
            const parts = token.split('.');
            header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
            payload = JSON.stringify(JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
        }
    } catch { payload = 'Token JWT inválido'; }
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>JWT Decode</Typography>
            <TextField fullWidth multiline rows={3} size="small" label="Token JWT" value={token} onChange={(e) => setToken(e.target.value)} sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 11 } }} />
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Header</Typography>
                    <Paper sx={{ p: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{header || '—'}</Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Payload</Typography>
                    <Paper sx={{ p: 2, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{payload || '—'}</Paper>
                </Grid>
            </Grid>
        </CardContent></Card>
    );
}

function XmlJsonConverter() {
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

function UtcConverter() {
    const [utc, setUtc] = useState('');
    const local = utc ? new Date(utc).toLocaleString('pt-BR', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) : '';
    const nowUtc = new Date().toISOString();
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>UTC ⇄ Fuso Local</Typography>
            <TextField fullWidth size="small" label="Data UTC (ISO)" value={utc} onChange={(e) => setUtc(e.target.value)} placeholder={nowUtc} />
            <Paper sx={{ p: 2, mt: 2, fontFamily: 'monospace' }}>
                <Typography variant="caption" color="text.secondary">Horário Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})</Typography>
                <Typography variant="body2">{local || '—'}</Typography>
            </Paper>
        </CardContent></Card>
    );
}

function UnitConverter() {
    const [value, setValue] = useState('');
    const [type, setType] = useState('bytes');
    const num = parseFloat(value);
    const conversions: Record<string, { label: string; results: { name: string; value: string }[] }> = {
        bytes: {
            label: 'Bytes', results: isNaN(num) ? [] : [
                { name: 'KB', value: (num / 1024).toFixed(4) }, { name: 'MB', value: (num / 1048576).toFixed(4) },
                { name: 'GB', value: (num / 1073741824).toFixed(6) }, { name: 'TB', value: (num / 1099511627776).toFixed(8) },
            ]
        },
        time: {
            label: 'Segundos', results: isNaN(num) ? [] : [
                { name: 'Milissegundos', value: (num * 1000).toFixed(0) }, { name: 'Minutos', value: (num / 60).toFixed(4) },
                { name: 'Horas', value: (num / 3600).toFixed(6) }, { name: 'Dias', value: (num / 86400).toFixed(6) },
            ]
        },
        percentage: {
            label: 'Porcentagem', results: isNaN(num) ? [] : [
                { name: 'Decimal', value: (num / 100).toFixed(6) }, { name: 'Fração (aprox)', value: `${num}/100` },
            ]
        },
    };
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Conversão de Unidades</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Tipo</InputLabel>
                        <Select value={type} label="Tipo" onChange={(e) => setType(e.target.value)}>
                            <MenuItem value="bytes">Bytes</MenuItem><MenuItem value="time">Tempo (s)</MenuItem><MenuItem value="percentage">Porcentagem</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 8 }}>
                    <TextField fullWidth size="small" label={conversions[type].label} value={value} onChange={(e) => setValue(e.target.value)} />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {conversions[type].results.map(r => (
                    <Paper key={r.name} sx={{ p: 1.5, flex: 1, minWidth: 120 }}>
                        <Typography variant="caption" color="text.secondary">{r.name}</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.value}</Typography>
                    </Paper>
                ))}
            </Box>
        </CardContent></Card>
    );
}

function TextCasing() {
    const [input, setInput] = useState('');
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Alteração de Casing</Typography>
            <TextField fullWidth multiline rows={3} size="small" label="Texto" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                    { label: 'UPPER', fn: (s: string) => s.toUpperCase() },
                    { label: 'lower', fn: (s: string) => s.toLowerCase() },
                    { label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
                    { label: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
                    { label: 'snake_case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
                    { label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
                ].map(c => (
                    <Tooltip key={c.label} title={input ? c.fn(input) : ''}>
                        <Button size="small" variant="outlined" onClick={() => { if (input) copyToClipboard(c.fn(input)); }}>{c.label}</Button>
                    </Tooltip>
                ))}
            </Box>
            {input && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {[
                        { label: 'UPPER', value: input.toUpperCase() },
                        { label: 'lower', value: input.toLowerCase() },
                        { label: 'Title', value: input.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
                    ].map(r => (
                        <Paper key={r.label} sx={{ p: 1.5, flex: 1, minWidth: 150 }}>
                            <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{r.value}</Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </CardContent></Card>
    );
}

function TextCompare() {
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

function CharCounter() {
    const [input, setInput] = useState('');
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split('\n').length : 0;
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Contador de Caracteres</Typography>
            <TextField fullWidth multiline rows={4} size="small" label="Texto" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {[
                    { label: 'Caracteres', value: input.length },
                    { label: 'Sem espaços', value: input.replace(/\s/g, '').length },
                    { label: 'Palavras', value: words },
                    { label: 'Linhas', value: lines },
                ].map(r => (
                    <Paper key={r.label} sx={{ p: 1.5, flex: 1, minWidth: 100, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main">{r.value}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                    </Paper>
                ))}
            </Box>
        </CardContent></Card>
    );
}

function TextNormalizer() {
    const [input, setInput] = useState('');
    const normalized = input.replace(/\s+/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const noAccents = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
        <Card><CardContent>
            <Typography variant="h6" gutterBottom>Normalização e Limpeza de Texto</Typography>
            <TextField fullWidth multiline rows={3} size="small" label="Texto" value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Paper sx={{ p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Normalizado (espaços limpos)</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>{normalized || '—'}</Typography>
                        {normalized && <IconButton size="small" onClick={() => copyToClipboard(normalized)}><ContentCopy fontSize="small" /></IconButton>}
                    </Box>
                </Paper>
                <Paper sx={{ p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">Sem acentos</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>{noAccents || '—'}</Typography>
                        {noAccents && <IconButton size="small" onClick={() => copyToClipboard(noAccents)}><ContentCopy fontSize="small" /></IconButton>}
                    </Box>
                </Paper>
            </Box>
        </CardContent></Card>
    );
}

export default function ToolsPage() {
    const [tab, setTab] = useState(0);
    return (
        <Box>
            <Typography variant="h5" gutterBottom>Portal de Ferramentas</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none' } }}>
                <Tab label="Conversões" /><Tab label="Formatadores" /><Tab label="Encode/Decode" /><Tab label="Texto" />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <NumberConverter /><TimestampConverter /><UtcConverter /><UnitConverter />
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <JsonFormatter /><JsonCsvConverter /><XmlJsonConverter />
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Base64Tool /><UrlEncodeTool /><JwtDecoder />
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextCasing /><TextNormalizer /><TextCompare /><CharCounter />
                </Box>
            </TabPanel>
        </Box>
    );
}
