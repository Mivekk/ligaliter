export const fetchWords = async (
  setWordList: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const res = await fetch(
    "https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt"
  );

  let text = await res.text();
  text = text.replaceAll("\r", "");

  const wordList = text.split("\n");
  setWordList(wordList);
};
