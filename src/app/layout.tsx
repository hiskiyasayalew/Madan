import Header from './components/ui/Header';
// import Footer from './components/ui/Footer';
import Preloader from './components/ui/Preloader';
import './globals.css';
import { LanguageProvider } from "./context/LanguageContext";
export const metadata = {
  title: 'Church Website',
  description: 'Welcome to Madan Church',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen overflow-x-hidden overflow-y-auto">
        <Preloader>
          <LanguageProvider>
          <main>{children}</main>
          </LanguageProvider>
          {/* <Footer /> */}
        </Preloader>
      </body>
    </html>
  );
}
