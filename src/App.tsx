import { useEffect, useState } from "react";
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
          setText({...sorted});
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
              <h2>Import TRP Data</h2>
              <input type="file" className="fullwidth" />
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

function YearComponent(tabyear: any) {
  const [subTabIndex, setSubTabIndex] = useState(0);

  return (
    <div>
      <Tabs
        selectedIndex={subTabIndex}
        onSelect={(index) => setSubTabIndex(index)}
      >
        <TabList key="yearHeader">
          {!!tabyear &&
            Object.keys(tabyear.year).map((keyName, i, value) => (
              <Tab key={i}>{keyName}</Tab>
            ))}
        </TabList>

        {!!tabyear &&
          Object.keys(tabyear.year).map((keyName, i) => (
            <TabPanel key={"yearValue" + i + keyName}>
              <MonthComponent month={tabyear.year[keyName]}></MonthComponent>
            </TabPanel>
          ))}
      </Tabs>
    </div>
  );
}

function MonthComponent(month: any) {
  const number = 1;
  const [scrollMonth, setScrollMonth] = useState<lineObject[][]>(
    month.month.slice(0, number)
  );

  useEffect(() => {
    if (scrollMonth[0].length < 50) {
      fetchData();
    }
  }, []);

  const fetchData = () => {
    setScrollMonth(month.month.slice(0, scrollMonth.length + number));
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={scrollMonth.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {scrollMonth.map((line: lineObject[], i: number) => (
          <SessionComponent key={i} line={line}></SessionComponent>
        ))}
      </InfiniteScroll>
    </div>
  );
}

function SessionComponent(session: any) {
  const sessionDate = session.line[0].date;
  return (
    <div>
      <div>Session {sessionDate.toString().slice(0, 15)}</div>
      <div>
        {session.line.map((line: lineObject, i: number) => (
          <LineComponent key={i} line={line}></LineComponent>
        ))}
      </div>
    </div>
  );
}

function LineComponent(line: any) {
  const lineObject = line.line;

  const className = setClassName(lineObject.type);

  function setClassName(type: string): string {
    switch (type) {
      case "emote":
      case "wowemote":
        return "orange";
      case "yell":
        return "red";
      case "party":
        return "blue";
      case "raid":
        return "orange";
      case "whisper":
      case "whisperto":
        return "pink";
      default:
        return "white";
    }
  }

  return (
    <div className="grid">
      <div className="a">{lineObject.date.toString().slice(16, 24)}</div>
      <div className="b">{lineObject.character}</div>
      <div className={className}>{lineObject.text}</div>
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
