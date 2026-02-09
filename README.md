DB Schema
Match           Commentary

-ID
-Hometeam       -ID
-Awayteam       -MatchId
-Starttime      -Actor(Who)
-Status         -Message(What)
-Homescore      -Minute(When)
-Awayscore      -SequenceNo(Order)
                -Details


const webFan = new WebSocket("ws://localhost:8000/ws");

webFan.onmessage = (e) => {
  console.log(
    "%c[Browser Fan]",
    "color: #00c853; font-weight: bold",
    JSON.parse(e.data)
  );
};

webFan.onopen = () => {
  webFan.send(
    JSON.stringify({ type: "subscribe", matchId: 1 })
  );
  console.log("Browser fan subscribed to Match 1");
};
