// app/layout.js
import './styles/globals.css';
import I18nProvider from './provider';
import Head from 'next/head';
export const metadata = {
  title: 'YouTube Downloader',
  description: 'Download YouTube videos easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Font Awesome CDN link */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
