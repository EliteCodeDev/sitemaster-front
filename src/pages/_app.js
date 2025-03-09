import '../styles/globals.css';
import 'react-phone-input-2/lib/style.css';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head'
import { ThemeProvider } from "../components/ui/theme-provider"

import { Toaster } from 'sonner';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        //  enableSystem={false}
        disableTransitionOnChange>
        <SessionProvider session={session}>
          <ProgressBar
            height="3px"
            color="#800080" // Hex code for purple
            options={{ showSpinner: false }}
            shallowRouting
          />
          <Toaster closeButton richColors position="top-right" />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
