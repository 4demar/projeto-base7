import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.sans};
    background:
      radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.25), transparent 60%),
      radial-gradient(900px 500px at 110% 110%, rgba(34,197,94,0.18), transparent 60%),
      ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }
  input { font-family: inherit; }
`;
