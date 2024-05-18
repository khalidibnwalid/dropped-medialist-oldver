import Layout from '@/components/pagesComponents/layout';
import { Providers } from '@/components/pagesComponents/providers';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import '../utils/globals.css';
import Head from 'next/head';

const poppins = Poppins({ weight: '400', subsets: ['latin'] })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <Head>
        <title>MediaList</title>
      </Head>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </div>
  )
}