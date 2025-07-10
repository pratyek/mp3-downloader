// app/layout.js
import './styles/globals.css';
import I18nProvider from './provider';

export const metadata = {
  title: 'YouTube Downloader',
  description: 'Download YouTube videos easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
