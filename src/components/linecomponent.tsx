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
