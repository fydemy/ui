import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Banner } from "fumadocs-ui/components/banner";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Banner id="reg-npmjs">
          We just registered to npmjs.com! @fydemy/ui
        </Banner>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
