import { client } from "@/utils/createUrqlClient";
import type { AppProps } from "next/app";
import { Provider } from "urql";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}
