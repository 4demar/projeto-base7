import { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ContentCopy } from "@mui/icons-material";
import { copyToClipboard } from "./copyToClipboard";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  let output = "";
  try {
    output = JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    output = input ? "JSON inválido" : "";
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          JSON Formatter
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              rows={8}
              size="small"
              label="JSON"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ "& textarea": { fontFamily: "monospace", fontSize: 12 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 2,
                minHeight: 200,
                fontFamily: "monospace",
                fontSize: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {output || "—"}
              {output && output !== "JSON inválido" && (
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 4, right: 4 }}
                  onClick={() => copyToClipboard(output)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
