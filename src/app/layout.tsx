import "./globals.css";
import "@/styles/header.css";
import "@/styles/footer.css";
import "@/styles/login.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Providers } from "./provider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <title>Anges</title>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        <Providers>
          <Header />

          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
