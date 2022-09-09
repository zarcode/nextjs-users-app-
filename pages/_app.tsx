import React from "react";
import type { AppProps, AppInitialProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate, DehydratedState } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
