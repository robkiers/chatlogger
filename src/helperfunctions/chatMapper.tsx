import { lineObject } from "../App";
import { emoteList } from "./emoteList";

export function chatMapper(lines: string[], year: number): lineObject[] {
  yearNumber = year;
  return lines.map((line, index, array) => {
    if (
      line.startsWith("1/") &&
      index !== 0 &&
      array[index - 1].startsWith("12/")
    ) {
      yearNumber = yearNumber + 1;
    }
    return mapLine(line);
  });
}

let yearNumber: number;

function mapLine(line: string): lineObject {
  let yearString = yearNumber + "-";
  const name = line.slice(line.indexOf("  ") + 2);
  const type = defineLineType(name);
  if (type === "raid" || type === "party" || type === "whisperto") {
    return {
      date: new Date(yearString + line.slice(0, 17).replace("/", "-")),
      character: name.slice(name.indexOf("|h ") + 3, name.indexOf("-")),
      realm: name.slice(name.indexOf("-") + 1, name.indexOf(" ")),
      type: type,
      text: name.slice(name.indexOf(": ") + 1),
      favorite: false,
      notes: "",
      tags: [""],
      characterCollection: [""],
    };
  } else if (type === "wowemote") {
    return {
      date: new Date(yearString + line.slice(0, 17).replace("/", "-")),
      character: name.slice(0, name.indexOf(" ")),
      realm: 'ArgentDawn',
      type: type,
      text: name.slice(name.indexOf(" ")),
      favorite: false,
      notes: "",
      tags: [""],
      characterCollection: [""],
    };
  } else {
    return {
      date: new Date(yearString + line.slice(0, 17).replace("/", "-")),
      character: name.slice(0, name.indexOf("-")),
      realm: name.slice(name.indexOf("-") + 1, name.indexOf(" ")),
      type: type,
      text: name.slice(name.indexOf(" ")),
      favorite: false,
      notes: "",
      tags: [""],
      characterCollection: [""],
    };
  }
}

function defineLineType(line: string) {
  if (line.startsWith("|Hchannel:PARTY|")) {
    return "party";
  } else if (line.startsWith("|Hchannel:RAID|")) {
    return "raid";
  } else if (line.startsWith("To")) {
    return "whisperto";
  } else if (
    emoteList.some((rx) => rx.test(line))
  ) {
    return "wowemote";
  } else if (line.slice(line.indexOf(" ") + 1).startsWith("says:")) {
    return "say";
  } else if (line.slice(line.indexOf(" ") + 1).startsWith("yells:")) {
    return "yell";
  } else if (line.slice(line.indexOf(" ") + 1).startsWith("whispers:")) {
    return "whisper";
  } else {
    console.log('line', line)
    return "emote";
  }
}
