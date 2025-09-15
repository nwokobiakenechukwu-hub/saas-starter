import QueryProvider from "../providers/QueryProvider";
import "../styles/tokens.scss";

export const metadata = { title: "SaaS Starter" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body><QueryProvider>{children}</QueryProvider></body></html>
  );
}
