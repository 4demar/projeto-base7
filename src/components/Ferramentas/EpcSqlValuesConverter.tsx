import { useMemo, useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Paper, IconButton, MenuItem, Alert, Grid } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from './copyToClipboard';

// Ordem fixa das colunas na tupla SQL: (Barcode, Data, Hex)
const FIELDS = ['Barcode', 'Data', 'Hex'] as const;

// Offsets disponíveis para o fuso de saída (em horas): UTC e fusos do Brasil
const OFFSETS: { value: number; label: string }[] = [
    { value: 0, label: 'UTC±00:00 (UTC)' },
    { value: -2, label: 'UTC-02:00 (Fernando de Noronha)' },
    { value: -3, label: 'UTC-03:00 (Brasília)' },
    { value: -4, label: 'UTC-04:00 (Amazonas)' },
    { value: -5, label: 'UTC-05:00 (Acre)' },
];

/**
 * Converte a saída do Mongo shell (ObjectId(...), ISODate(...), comentários, vírgulas soltas)
 * em JSON válido e retorna a lista de documentos.
 */
function parseMongoShell(text: string): Record<string, unknown>[] {
    let src = text
        // remove comentários /* ... */ e // ...
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        // ObjectId("x"), ISODate("x"), NumberLong(1) etc. → valor simples
        .replace(/\b(?:ObjectId|ISODate|NumberLong|NumberInt|NumberDecimal|UUID|Date)\s*\(\s*("(?:[^"\\]|\\.)*"|[^)]*?)\s*\)/g,
            (_, v: string) => (v.startsWith('"') ? v : JSON.stringify(v.trim())))
        .trim()
        .replace(/,\s*$/, '');

    if (!src.startsWith('[')) src = `[${src}]`;
    // remove vírgulas antes de } ou ]
    src = src.replace(/,(\s*[}\]])/g, '$1');

    const parsed: unknown = JSON.parse(src);
    return (Array.isArray(parsed) ? parsed : [parsed]) as Record<string, unknown>[];
}

type InputFormat = 'json' | 'csv';

const FORMATS: { value: InputFormat; label: string }[] = [
    { value: 'json', label: 'Mongo JSON' },
    { value: 'csv', label: 'C# (CSV com ";")' },
];

// Posição das colunas no formato ";":
// Tipo;Id;Hex;Barcode;Tid;"Data";LeitorId;Flag
const CSV_COL = { hex: 2, barcode: 3, data: 5 } as const;

/** Divide uma linha por ';', respeitando valores entre aspas (com "" como escape). */
function splitCsvLine(line: string): string[] {
    const cols: string[] = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quoted) {
            if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
            else if (ch === '"') quoted = false;
            else cur += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === ';') { cols.push(cur.trim()); cur = ''; }
        else cur += ch;
    }
    cols.push(cur.trim());
    return cols;
}

/** Converte 'dd/MM/yyyy HH:mm:ss[.SSS]' (interpretada como UTC) em ISO. */
function parseBrDate(value: string): string {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/.exec(value);
    if (!m) throw new Error(`Data inválida: ${value}`);
    const [, dd, MM, yyyy, HH, mm, ss, ms = '0'] = m;
    return new Date(Date.UTC(+yyyy, +MM - 1, +dd, +HH, +mm, +ss, +ms.padEnd(3, '0'))).toISOString();
}

/** Converte linhas no formato ';' em documentos { Barcode, Data, Hex }. */
function parseCsvLines(text: string): Record<string, unknown>[] {
    return text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .map((line, i) => {
            const cols = splitCsvLine(line);
            if (cols.length <= CSV_COL.data) {
                throw new Error(`Linha ${i + 1}: esperado ao menos ${CSV_COL.data + 1} colunas, encontrado ${cols.length}`);
            }
            return {
                Barcode: cols[CSV_COL.barcode],
                Data: parseBrDate(cols[CSV_COL.data]),
                Hex: cols[CSV_COL.hex],
            };
        });
}

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

/** Formata a data como 'yyyy-MM-dd HH:mm:ss.SSS' no offset informado (horas em relação ao UTC). */
function formatDate(value: unknown, offsetHours: number): string {
    const raw = typeof value === 'object' && value !== null && '$date' in value
        ? (value as { $date: unknown }).$date
        : value;
    const date = new Date(raw as string);
    if (Number.isNaN(date.getTime())) throw new Error(`Data inválida: ${String(raw)}`);

    const d = new Date(date.getTime() + offsetHours * 3_600_000);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} `
        + `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.${pad(d.getUTCMilliseconds(), 3)}`;
}

const sqlString = (v: string) => `'${v.replace(/'/g, "''")}'`;

export default function EpcSqlValuesConverter() {
    const [input, setInput] = useState('');
    const [offset, setOffset] = useState(-5);
    const [format, setFormat] = useState<InputFormat>('json');

    const { output, error, count } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '', count: 0 };
        try {
            const docs = format === 'csv' ? parseCsvLines(input) : parseMongoShell(input);
            const rows = docs.map((doc, i) => {
                const missing = FIELDS.filter(f => doc[f] === undefined || doc[f] === null);
                if (missing.length) throw new Error(`Documento ${i + 1}: campo(s) ausente(s): ${missing.join(', ')}`);
                const barcode = sqlString(String(doc.Barcode));
                const data = sqlString(formatDate(doc.Data, offset));
                const hex = sqlString(String(doc.Hex));
                return `(${barcode}, ${data}, ${hex})`;
            });
            return { output: rows.join(',\n') + ';', error: '', count: rows.length };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Erro na conversão', count: 0 };
        }
    }, [input, offset, format]);

    return (
        <Card>
            <CardContent>
            <Typography variant="h6" gutterBottom>EPC(JSON/CSV) → SQL VALUES</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {format === 'csv'
                    ? 'Cole as linhas no formato Tipo;Id;Hex;Barcode;Tid;"dd/MM/yyyy HH:mm:ss";... (uma por linha).'
                    : 'Cole a lista de documentos (formato Mongo shell, com ObjectId/ISODate).'}
                {' '}Gera tuplas na ordem (Barcode, Data, Hex).
            </Typography>

            <TextField
                select size="small" label="Formato de entrada" value={format}
                onChange={(e) => {
                    const next = e.target.value as InputFormat;
                    setFormat(next);
                    // No formato ";" a data já vem no fuso desejado; por padrão não altera
                    setOffset(next === 'csv' ? 0 : -5);
                }}
                sx={{ mb: 2, minWidth: 280 }}
            >
                {FORMATS.map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                ))}
            </TextField>
            
            <Grid container spacing={2}>
                {/* Entrada (esquerda) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth multiline rows={16} size="small" label={format === 'csv' ? 'Entrada (linhas ;)' : 'Entrada (JSON)'}
                        value={input} onChange={(e) => setInput(e.target.value)}
                        sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 12 } }}
                    />
                </Grid>

                {/* Resultado (direita) — no desktop ocupa exatamente a altura da entrada */}
                <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative', minHeight: { xs: 300, md: 'auto' } }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            position: 'absolute', inset: 0,
                            p: 2, pr: 6, fontFamily: 'monospace', fontSize: 12,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto',
                        }}
                    >
                        {output || <Typography component="span" variant="body2" color="text.secondary">Resultado (SQL)</Typography>}
                    </Paper>
                    {output && (
                        <IconButton size="small" aria-label="Copiar resultado" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => copyToClipboard(output)}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    )}
                </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {count > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">{count} registro(s) convertido(s)</Typography>
                </Box>
            )}

            <TextField
                select size="small" label="Fuso de saída" value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
                sx={{ mt: 2, minWidth: 280 }}
                helperText={format === 'csv'
                    ? 'A data de entrada é tratada como UTC e convertida para este fuso (use UTC±00:00 para manter)'
                    : 'A data ISO é convertida para este fuso'}
            >
                {OFFSETS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
            </TextField>
            </CardContent>
        </Card>
    );
}
