import { ReactNode } from "react";
import Providers from "./Providers";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full flex flex-col overflow-hidden">
        <Providers>
          <Header />

          <div className="flex flex-grow min-h-screen">
            <Sidebar />
            <main
              id="main-content"
              className="flex-grow min-h-[calc(100vh-8dvh)] overflow-y-auto bg-deepNavy p-6 ml-20 transition-all duration-300 md:ml-64"
              role="main"
              aria-labelledby="page-title"
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
