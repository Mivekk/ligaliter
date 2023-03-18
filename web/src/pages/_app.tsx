import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "urql";
import { client } from "@/utils/createUrqlClient";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}
