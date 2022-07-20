
$(function() {
  $("#header").load("../header.html");
  $("#footer").load("../footer.html");
});

const socket = io();

function sortData(data, options) {
  let newData = [];
  for (i = 0; i < data.length; i++) {
    const game = data[i];
    const complexity = parseInt(game[2]);
    const playersMin = parseInt(game[3]);
    const playersMax = parseInt(game[4]);
    const time = parseInt(game[5]);
    if (
      // Complexity
      options.complexityMin <= complexity && complexity <= options.complexityMax
      &&
      // Players
      ((options.playersMin <= playersMin && playersMin <= options.playersMax) || (options.playersMin <= playersMax && playersMax <= options.playersMax))
      &&
      // Time
      options.timeMin <= time && time <= options.timeMax
    ) newData.push(game);
  }
  
  switch(options.sortType) {
    case 0:
      newData = newData.sort((a, b) => {
        return a[0] > b[0] ? 1 : -1;
      });
      break;
    case 1:
      newData = newData.sort((a, b) => {
        return a[0] < b[0] ? 1 : -1;
      });
      break;
    case 2:
      newData = newData.sort((a, b) => {
        return a[2] - b[2];
      });
      break;
    case 3:
      newData = newData.sort((a, b) => {
        return b[2] - a[2];
      });
      break;
    case 4:
      newData = newData.sort((a, b) => {
        return a[5] - b[5];
      });
      break;
    case 5:
      newData = newData.sort((a, b) => {
        return b[5] - a[5];
      });
      break;
  }

  return newData;
}

socket.emit("get-data");
socket.on("get-data", (data) => {
  let newData = sortData(data, {sortType: 0, complexityMin: 1, complexityMax: 10, playersMin: 1, playersMax: 12, timeMin: 10, timeMax: 120});
  for (i = 0; i < newData.length; i++) {
    const game = newData[i];
    let element = "<div>";
    if (game[6] != null) element += `<a href="${game[6]}"><img class="gameCover" src="${game[1]}"></a>`;
    else element += `<img class="gameCover" src="${game[1]}">`;
    element += `<div class="gameTitle">${game[0]}</div>`;
    element += "</div>";
    $("#games").append(element);
  }
});