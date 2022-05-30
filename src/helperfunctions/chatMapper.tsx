import { lineObject } from "../App";

export function chatMapper(lines: string[], year: number): lineObject[] {
  return lines.map((line) => mapLine(line, year));
}

function mapLine(line: string, year: number): lineObject {
  const yearString = year + "-";
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
  } else if (line.slice(line.indexOf(" ") + 1).startsWith("says:")) {
    return "say";
  } else if (line.slice(line.indexOf(" ") + 1).startsWith("yells:")) {
    return "yell";
  } else if (line.slice(line.indexOf(" ") + 1).startsWith("whispers:")) {
    return "whisper";
  } else {
    return "emote";
  }
}
