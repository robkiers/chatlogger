import { lineObject } from "../App";

export function chatSorter(lines: lineObject[], previous?: any) {
  let yearNumber = lines[0].date.getFullYear();
  let monthNumber = lines[0].date.getMonth() + 1;
  let session: lineObject[] = [];

  let previousTime = 0;
  const difference = 7200000;

  let year: { [char: number]: { [char: number]: lineObject[][] } } = {
    [yearNumber]: {
      [monthNumber]: [],
    },
  };

  if (previous) {
    const lastYearName = Object.keys(previous).pop() as string;
    const lastMonthName = Object.keys(previous[lastYearName]).pop() as string;

    year = previous;
    session = [...year[+lastYearName][+lastMonthName].pop()!];
    previousTime = session.at(-1)!.date.getTime();
  }

  lines.forEach((line, idx, array) => {
    const lineTime = line.date.getTime();

    if (lineTime - previousTime <= difference && lineTime > previousTime) {
      session.push(line);
    } else if (idx === 0) {
      session.push(line);
    } else if (lineTime - previousTime > difference) {
      if (!!year[yearNumber][monthNumber]) {
        year[yearNumber][monthNumber].push([...session]);
      } else {
        year[yearNumber][monthNumber] = [[...session]];
      }

      monthNumber = line.date.getMonth() + 1;
      yearNumber = line.date.getFullYear();
      session = [line];
    }
    if (idx === array.length - 1) {
      if (!!year[yearNumber] && !!year[yearNumber][monthNumber]) {
        year[yearNumber][monthNumber].push([...session]);
      } else if (!!year[yearNumber]) {
        year[yearNumber][monthNumber] = [[...session]];
      } else {
        year[yearNumber] = {};
        year[yearNumber][monthNumber] = [[...session]];
      }
    }
    previousTime = lineTime;
  });

  return year;
}
