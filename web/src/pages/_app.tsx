import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Liga Liter</title>
      </Head>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Component {...pageProps} />
      </DndProvider>
    </>
  );
}
