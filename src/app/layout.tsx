import type { Metadata } from "next";
import "@/styles/globals.scss";
import Header from "./components/Header";
import GuideChatbot from "./components/GuideChatbot";

export const metadata: Metadata = {
  title: "AI React Study",
  description: "React 학습을 돕는 AI 스터디 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <GuideChatbot/>
      </body>
    </html>
  );
}
