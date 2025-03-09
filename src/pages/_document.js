import { Html, Head, Main, NextScript } from "next/document";


export default function Document() {
  return (
    <Html lang="es" className="h-full   dark:bg-[var(--app-bg-dark)]  bg-[var(--app-bg-light)]">
      <Head>
      <link href="https://rsms.me/inter/inter.css" rel="stylesheet"/>
      </Head>
      <body className="bg-[var(--app-bg-light)] dark:bg-[var(--app-bg-dark)] h-full ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
