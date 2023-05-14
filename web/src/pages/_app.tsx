import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <Component {...pageProps} />
    </DndProvider>
  );
}
