import { Html, Head, Main, NextScript } from "next/document";


export default function Document() {
  return (
    <Html lang="es" className="h-full bg-gray-100">
      <Head>
      <link href="https://rsms.me/inter/inter.css" rel="stylesheet"/>
      </Head>
      <body className="bg-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
