import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'node:child_process'

/**
 * Endpoint local (apenas no dev server) para abrir o Notepad do Windows.
 * O navegador não pode executar programas locais, então o front faz
 * POST /local/abrir-notepad e o processo Node do Vite inicia o notepad.exe.
 */
function abrirNotepadPlugin(): Plugin {
  return {
    name: 'abrir-notepad',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/local/abrir-notepad', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Método não permitido')
          return
        }
        if (process.platform !== 'win32') {
          res.statusCode = 501
          res.end('Disponível apenas no Windows')
          return
        }
        try {
          const proc = spawn('notepad.exe', [], { detached: true, stdio: 'ignore' })
          proc.on('error', err => server.config.logger.error(`[abrir-notepad] ${err.message}`))
          proc.unref()
          res.statusCode = 204
          res.end()
        } catch (err) {
          res.statusCode = 500
          res.end(err instanceof Error ? err.message : 'Erro ao abrir o Notepad')
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), abrirNotepadPlugin()],
})
