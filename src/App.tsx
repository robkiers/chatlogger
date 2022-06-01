import { ChangeEvent, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "the-new-css-reset/css/reset.css";
import "react-tabs/style/react-tabs.css";
import "./App.scss";
import { chatFilter } from "./helperfunctions/chatFilter";
import { chatMapper } from "./helperfunctions/chatMapper";
import { chatSorter } from "./helperfunctions/chatSorter";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [text, setText] = useState<any>();
  // const [tabIndex, setTabIndex] = useState(0);
  const [inputYear, setYear] = useState(2020);
  // const [inputMinute, setInputMinute] = useState(2020);

  const showFile = async (e: any) => {
    e.preventDefault();

    const reader = new FileReader();

    const fileimport = e.target.files[0];
    reader.onload = (e) => {
      if (e.target) {
        const file = e.target.result as string;
        const lines = chatFilter(file.split(/\r\n|\n/));
        const mapped = chatMapper(lines, inputYear);

        if (text) {
          const sorted = chatSorter(mapped, text);
          setText({ ...sorted });
        } else {
          const sorted = chatSorter(mapped);
          setText(sorted);
        }
      }
    };
    reader.onerror = (e) => alert(e.target?.error?.name);
    reader.readAsText(fileimport);
  };

  const downloadFile = async () => {
    const myData = text;
    const fileName = "file";
    const json = JSON.stringify(myData);

    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadFile = async (e: any) => {
    e.preventDefault();

    const reader = new FileReader();

    const fileimport = e.target.files[0];
    reader.onload = (e) => {
      if (e.target) {
        const file = JSON.parse(e.target?.result as string, (key, value) =>
          key === "date" ? new Date(value) : value
        );
        setText(file);
      }
    };
    reader.onerror = (e) => alert(e.target?.error?.name);
    reader.readAsText(fileimport);
  };

  function removeEntries(year: any, month: any, array: any) {
    console.log("removeEntries", year, month, array);
    console.log("text", text[year][month]);
    const sessionDelete = text[year][month];
    console.log("sessionDelete pre", sessionDelete);
    array.forEach((element: any, index: number) => {
      console.log('a', element);
      sessionDelete[element.sessionId].filter((value: lineObject) => value.date.getTime() !== element.lineDate.getTime());
      console.log('b', sessionDelete[element.sessionId].filter((value: lineObject) => value.date.getTime() !== element.lineDate.getTime()));
    });
    console.log("sessionDelete aft", sessionDelete);
  }

  return (
    <div className="App">
      <Tabs>
        <TabList key="yearHeader">
          {!!text &&
            Object.keys(text).map((keyName, i) => <Tab key={i}>{keyName}</Tab>)}
          <Tab>settings</Tab>
        </TabList>

        {!!text &&
          Object.keys(text).map((keyName, i) => (
            <TabPanel key={"yearValue" + i + keyName}>
              <YearComponent
                key={"yearValueC" + i + keyName}
                year={text[keyName]}
                yearName={keyName}
                removeEntries={removeEntries}
              ></YearComponent>
            </TabPanel>
          ))}

        <TabPanel key="15">
          <div className="displaycontainer">
            <div className="inputContainer">
              <h2>Import json</h2>
              <div>
                <input
                  className="fullwidth"
                  type="file"
                  onChange={(e) => loadFile(e)}
                />
              </div>
              <div>Import previously saved json file</div>
            </div>
            <div className="inputContainer">
              <h2>Import Chatlog</h2>
              <div className="m-b">
                <input
                  className="fullwidth"
                  type="file"
                  onChange={(e) => showFile(e)}
                />
              </div>
              <div>
                Warcraft Chatlog do not record the year and you have to set the
                first year manually:
              </div>
              <input
                className="m-b fullwidth"
                type="number"
                defaultValue={inputYear}
                onChange={(e) => setYear(+e.target.value)}
              />
              <div>
                A session is determined by the amount of time between logging.
                You can set that amount of time here:
              </div>
              <div className="m-b">
                <input
                  type="number"
                  defaultValue="7200000"
                  className="fullwidth"
                />
              </div>
              <button onClick={() => downloadFile()}>Download Json file</button>
            </div>
            <div className="inputContainer">
              {/* <h2>Import TRP Data</h2>
              <input type="file" className="fullwidth" /> */}
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

function YearComponent(props: any) {
  const { year, yearName, removeEntries } = props;
  const [subTabIndex, setSubTabIndex] = useState(0);

  function deleteLines(deleteArray: any, monthNr: any) {
    console.log("year", year);
    removeEntries(yearName, monthNr, deleteArray);
  }

  return (
    <div>
      <Tabs
        selectedIndex={subTabIndex}
        onSelect={(index) => setSubTabIndex(index)}
      >
        <TabList key="yearHeader">
          {!!year &&
            Object.keys(year).map((keyName, i, value) => (
              <Tab key={i}>{keyName}</Tab>
            ))}
        </TabList>

        {!!year &&
          Object.keys(year).map((keyName, i) => (
            <TabPanel key={"yearValue" + i + keyName}>
              <MonthComponent
                month={year[keyName]}
                keyNR={keyName}
                deleteLines={deleteLines}
              ></MonthComponent>
            </TabPanel>
          ))}
      </Tabs>
    </div>
  );
}

function MonthComponent(props: any) {
  const { month, keyNR, deleteLines } = props;

  const number = 1;
  const [scrollMonth, setScrollMonth] = useState<lineObject[][]>(
    month.slice(0, number)
  );
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [deleteArray, setDeleteArray] = useState<any[]>([]);

  useEffect(() => {
    if (scrollMonth[0].length < 50) {
      fetchData();
    }
  }, []);

  const fetchData = () => {
    setScrollMonth(month.slice(0, scrollMonth.length + number));
    if (scrollMonth!.length >= month!.length) {
      setHasMore(false);
    }
  };

  const setArray = (value: any) => {
    if (!deleteArray.some((entry) => entry === value)) {
      setDeleteArray([...deleteArray, value]);
    } else {
      setDeleteArray(deleteArray.filter((entry) => entry !== value));
    }
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={scrollMonth.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Last session</b>
          </p>
        }
      >
        {scrollMonth.map((line: lineObject[], i: number) => (
          <SessionComponent
            key={i}
            session={line}
            keyNR={i}
            setDelete={setArray}
          ></SessionComponent>
        ))}
      </InfiniteScroll>
      {deleteArray.length > 0 ? (
        <div className="interactionContainer">
          <button onClick={(value) => deleteLines(deleteArray, keyNR)}>
            delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

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

function LineComponent(props: any) {
  const { line, keyNR, selectLine } = props;

  const className = setClassName(line.type);

  function setClassName(type: string): string {
    switch (type) {
      case "emote":
      case "wowemote":
        return "emoteColor";
      case "yell":
        return "yellColor";
      case "party":
        return "partyColor";
      case "raid":
        return "raidColor";
      case "whisper":
      case "whisperto":
        return "whisperColor";
      default:
        return "sayColor";
    }
  }

  return (
    <div className="grid">
      <div className="a">
        <input
          type="checkbox"
          onClick={(value) => selectLine(value, line.date)}
        ></input>
      </div>
      <div className="b">{line.date.toString().slice(16, 24)}</div>
      <div className="c">{line.character}</div>
      <div className={className}>{line.text}</div>
    </div>
  );
}

export default App;

export interface lineObject {
  date: Date;
  character: string;
  realm: string;
  type: string;
  text: string;
  favorite: boolean;
  tags: string[];
  notes: string;
  characterCollection: string[];
}
