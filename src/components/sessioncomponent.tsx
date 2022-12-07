import { ChangeEvent } from "react";
import { lineObject } from "../App";

function SessionComponent(props: any) {
  const { session, keyNR, setDelete } = props;
  const sessionDate = session[0].date;

  function selectLine(value: ChangeEvent<HTMLInputElement>, id: Date) {
    setDelete({ sessionId: keyNR, lineDate: id });
  }

  return (
    <div>
      <div>Session {sessionDate.toString().slice(0, 15)}</div>
      <div>
        {session.map((line: lineObject, i: number) => (
          <LineComponent
            line={line}
            keyNR={i}
            selectLine={selectLine}
            key={i}
          ></LineComponent>
        ))}
      </div>
    </div>
  );
}
