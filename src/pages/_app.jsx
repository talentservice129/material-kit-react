import Head from 'next/head';
import { getSession, SessionProvider, useSession } from 'next-auth/react';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { createEmotionCache } from '~/utils/create-emotion-cache';
import { theme } from '~/theme';

import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const [queryClient] = useState(() => new QueryClient());
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
      <SessionProvider session={ pageProps.session }>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <CacheProvider value={emotionCache}>
              <Head>
                <title>
                  PPenca WordlCup Prediction
                </title>
                <meta
                  name="viewport"
                  content="initial-scale=1, width=device-width"
                />
              </Head>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {getLayout(<Component {...pageProps} />)}
                  <ToastContainer />
                </ThemeProvider>
              </LocalizationProvider>
            </CacheProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
  );
};

export default App;
