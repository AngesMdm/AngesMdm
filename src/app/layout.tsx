import "./globals.css";
import "@/styles/header.css";
import "@/styles/footer.css";
import "@/styles/login.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Providers } from "./provider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-layout">
        <Providers>
          <Header />

          <main className="app-content">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
