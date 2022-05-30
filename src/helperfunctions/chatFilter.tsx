export function chatFilter(lines: string[]) {
  return lines
    .filter((line) => notEmpty(line))
    .filter((line) => pcChat(line))
    .filter((line) => notPCCraft(line))
    .filter((line) => notStartWith(line))
    .filter((line) => notEndWith(line))
    .filter((line) => notHave(line));
}

function notEndWith(string: string): boolean {
  return !stringEnd.some(function (suffix) {
    return string.endsWith(suffix);
  });
}
function notEmpty(string: string): boolean {
  return !!string;
}

function notStartWith(string: string): boolean {
  return !stringStart.some(function (suffix) {
    return string.substring(string.indexOf("  ") + 2).startsWith(suffix);
  });
}

function notHave(string: string): boolean {
  return !stringOther.some(function (suffix) {
    return string.includes(suffix);
  });
}

function notPartyRaidChannel(string: string): boolean {
  return !string
    .substring(string.indexOf("  ") + 2)
    .match(/^\|Hchannel:(?!\bRAID|\bPARTY)/);
}

function notNPCChat(string: string): boolean {
  return !string
    .substring(string.indexOf("  ") + 2)
    .match(/^(?!([\w\.\-]+)-([\w\-]+) \bsays).*says:/);
}

function notNPCYells(string: string): boolean {
  return !string
    .substring(string.indexOf("  ") + 2)
    .match(/^(?!([\w\.\-]+)-([\w\-]+) \byells).*yells:/);
}

function notPCCraft(string: string): boolean {
  return !string
    .substring(string.indexOf("  ") + 2)
    .match(/^[\p{L}\p{N}_]*-[\p{L}\p{N}_']* (\bcreates|\bperforms)/u);
}
// /^[\p{L}\p{N}_]*-[\p{L}\p{N}_]**
function pcChat(string: string) {
  return (
    string
      .substring(string.indexOf("  ") + 2)
      // .match(/^[\p{L}\p{N}_']*-[\p{L}\p{N}_]*/u);
      .match(
        /(^[\p{L}\p{N}_']*-[\p{L}\p{N}_]*|(^\|Hchannel:(\bRAID|\bPARTY))|^(\bTo (?!\|)))/u
      )
  );
}
// regex Realm (includes ') [\p{L}\p{N}_']
// regex player [\p{L}\p{N}_]
function pcYell(string: string) {
  return string
    .substring(string.indexOf("  ") + 2)
    .match(/^[\p{L}\p{N}_]*-[\p{L}\p{N}_]* \byells/u);
}

function pcEmote(string: string) {
  return string
    .substring(string.indexOf("  ") + 2)
    .match(/^[\p{L}\p{N}_]*-[\p{L}\p{N}_]* \bsays/u);
}

const stringEnd = [
  "has come online.",
  "has gone offline.",
  "FRIEND_OFFLINE",
  "FRIEND_ONLINE",
  "You are now Away: AFK",
  "You are no longer Away.",
  "Anima infused into the Reservoir.",
  "has left the raid group.",
  "is now the group leader",
  "You died.",
  "has died.",
  "has joined the raid group.",
  "has been added to your appearance collection.",
  "You are now queued in the Dungeon Finder.",
  "Dungeon Difficulty set to Event.",
  "has left the instance group.",
  "You leave the group.",
  "Legacy loot rules are enabled.",
  "Legacy loot rules are no longer in effect.",
];

const stringStart = [
  "Changed Channel: ",
  "Left Channel: ",
  "You receive loot: ",
  "You loot ",
  "You receive currency: ",
  "You receive item: ",
  "Reputation with ",
  "Received ",
  "Quest accepted:",
  "You create: ",
  "No player named ",
  "You are refunded ",
  "You've completed the set ",
];

const stringOther = [" receives loot: ", " has earned the achievement "];

// |-
// | /agree || ||
// | You agree. || You agree with ''&lt;target&gt;''.
// |- class="alt"
// | /amaze || ||  ||
// You are amazed!
// |
// You are amazed by ''&lt;target&gt;''.
// |-
// | /angry || x || || You raise your fist in anger.
// | You raise your fist in anger at ''&lt;target&gt;''.
// |- class="alt"
// | /apologize || ||  || You apologize to everyone. Sorry!
// | You apologize to ''&lt;target&gt;''. Sorry!