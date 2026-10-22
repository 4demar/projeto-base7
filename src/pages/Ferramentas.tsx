import { useState, type ComponentType, type MouseEvent } from 'react';
import { Box, Typography, Tabs, Tab, Menu, MenuItem, ListItemText, Breadcrumbs, Stack, Button } from '@mui/material';
import { ArrowDropDown, Check, EditNote } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
    NumberConverter,
    TimestampConverter,
    UtcConverter,
    UnitConverter,
    JsonFormatter,
    JsonCsvConverter,
    XmlJsonConverter,
    EpcSqlValuesConverter,
    Base64Tool,
    UrlEncodeTool,
    JwtDecoder,
    TextCasing,
    TextNormalizer,
    TextCompare,
    CharCounter,
} from '../components/Ferramentas';

interface FerramentaItem {
    label: string;
    component: ComponentType;
}

interface Categoria {
    label: string;
    items: FerramentaItem[];
}

const CATEGORIAS: Categoria[] = [
    {
        label: 'Conversões',
        items: [
            { label: 'Conversor de Números', component: NumberConverter },
            { label: 'Conversor de Timestamp', component: TimestampConverter },
            { label: 'Conversor UTC', component: UtcConverter },
            { label: 'Conversor de Unidades', component: UnitConverter },
        ],
    },
    {
        label: 'Formatadores',
        items: [
            { label: 'Formatador JSON', component: JsonFormatter },
            { label: 'JSON ⇄ CSV', component: JsonCsvConverter },
            { label: 'XML ⇄ JSON', component: XmlJsonConverter },
            { label: 'EPC(JSON/CSV) → SQL VALUES', component: EpcSqlValuesConverter },
        ],
    },
    {
        label: 'Encode/Decode',
        items: [
            { label: 'Base64', component: Base64Tool },
            { label: 'URL Encode', component: UrlEncodeTool },
            { label: 'Decodificador JWT', component: JwtDecoder },
        ],
    },
    {
        label: 'Texto',
        items: [
            { label: 'Maiúsculas/Minúsculas', component: TextCasing },
            { label: 'Normalizador de Texto', component: TextNormalizer },
            { label: 'Comparar Textos', component: TextCompare },
            { label: 'Contador de Caracteres', component: CharCounter },
        ],
    },
];

export default function Ferramentas() {
    // Categoria e ferramenta atualmente exibidas
    const [selecionado, setSelecionado] = useState({ categoria: 0, item: 0 });
    // Menu aberto: âncora (aba clicada) + índice da categoria
    const [menu, setMenu] = useState<{ anchor: HTMLElement; categoria: number } | null>(null);

    const abrirMenu = (e: MouseEvent<HTMLElement>, categoria: number) => setMenu({ anchor: e.currentTarget, categoria });
    const fecharMenu = () => setMenu(null);
    const selecionar = (categoria: number, item: number) => {
        setSelecionado({ categoria, item });
        fecharMenu();
    };

    // Chama o endpoint local do dev server (vite.config.ts) que inicia o notepad.exe
    const [abrindoNotepad, setAbrindoNotepad] = useState(false);
    const abrirNotepad = async () => {
        setAbrindoNotepad(true);
        try {
            const resp = await fetch('/local/abrir-notepad', { method: 'POST' });
            if (!resp.ok) throw new Error(await resp.text());
        } catch (err) {
            toast.error(`Não foi possível abrir o Notepad${err instanceof Error && err.message ? `: ${err.message}` : '.'}`);
        } finally {
            setAbrindoNotepad(false);
        }
    };

    const categoriaAtual = CATEGORIAS[selecionado.categoria];
    const ferramentaAtual = categoriaAtual.items[selecionado.item];
    const Componente = ferramentaAtual.component;

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h5">Portal de Ferramentas</Typography>
                <Button variant="outlined" startIcon={<EditNote />} onClick={abrirNotepad} disabled={abrindoNotepad}>
                    Abrir Notepad
                </Button>
            </Stack>

            <Tabs value={selecionado.categoria} sx={{ mb: 1, '& .MuiTab-root': { textTransform: 'none' } }}>
                {CATEGORIAS.map((cat, i) => (
                    <Tab
                        key={cat.label}
                        value={i}
                        label={cat.label}
                        icon={<ArrowDropDown />}
                        iconPosition="end"
                        aria-haspopup="menu"
                        aria-expanded={menu?.categoria === i}
                        aria-controls={menu?.categoria === i ? 'ferramentas-menu' : undefined}
                        onClick={(e) => abrirMenu(e, i)}
                        sx={{ minHeight: 48 }}
                    />
                ))}
            </Tabs>

            <Menu
                id="ferramentas-menu"
                anchorEl={menu?.anchor}
                open={Boolean(menu)}
                onClose={fecharMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                {menu && CATEGORIAS[menu.categoria].items.map((item, j) => {
                    const ativo = selecionado.categoria === menu.categoria && selecionado.item === j;
                    return (
                        <MenuItem key={item.label} selected={ativo} onClick={() => selecionar(menu.categoria, j)} sx={{ minWidth: 240 }}>
                            <ListItemText>{item.label}</ListItemText>
                            {ativo && <Check fontSize="small" sx={{ ml: 2 }} />}
                        </MenuItem>
                    );
                })}
            </Menu>

            <Breadcrumbs sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">{categoriaAtual.label}</Typography>
                <Typography variant="body2" color="text.primary">{ferramentaAtual.label}</Typography>
            </Breadcrumbs>

            {/* key força remontagem ao trocar de ferramenta */}
            <Componente key={`${selecionado.categoria}-${selecionado.item}`} />
        </Box>
    );
}
