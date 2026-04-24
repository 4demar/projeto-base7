import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import {
    TabPanel,
    NumberConverter,
    TimestampConverter,
    UtcConverter,
    UnitConverter,
    JsonFormatter,
    JsonCsvConverter,
    XmlJsonConverter,
    Base64Tool,
    UrlEncodeTool,
    JwtDecoder,
    TextCasing,
    TextNormalizer,
    TextCompare,
    CharCounter,
} from '../components/Ferramentas';

export default function Ferramentas() {
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
