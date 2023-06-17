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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta
          name="description"
          content="Introducing 'Liga Liter' - The Discord-inspired Scrabble-Like Online Multiplayer Game! 
            Engage in thrilling wordplay battles, challenge friends, and showcase your linguistic prowess. 
            Create game rooms, invite friends, and experience real-time multiplayer matches. 
            Strategically form words using letter tiles, exploit bonus squares, and dominate the leaderboard.             
            Liga Liter is the ultimate choice for word enthusiasts and competitive gamers. 
            Unleash your vocabulary, conquer the realm of words, and become a Liga Liter champion!"
        />
      </Head>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Component {...pageProps} />
      </DndProvider>
    </>
  );
}
