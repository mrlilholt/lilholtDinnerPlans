import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Set your custom font and weights.
    fontFamily: 'Roboto, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightBold: 700,
  },
  // You can add more customizations, if needed.
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Global setup if needed.
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        {/* Include Roboto font with desired weights */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif !important;
          font-weight: 300 !important;
        }
      `}</style>
    </ThemeProvider>
  );
}

export default MyApp;