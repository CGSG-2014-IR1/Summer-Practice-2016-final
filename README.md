# Summer-Practice-2016-final
My final summer practice task.

<p>To play:</p>
<ol>
  <li> Run index.js
  <li> Enter localhost:8000/index.html
  <li> First 2 connections will be players, all others - spectators
  <li> Click on image to choose side
  <li> Arrow buttons to move selector, Enter to confirm movement
  <li> Insert to end turn
</ol>
<br>
<p>Balance</p>
<p>All figures' stats can be tweaked in /assets/figures/*.json</p>
<br>
<p>Bugs</p>
<ol>
  <li> If >= 3 connections created too fast, spectator filter may fail
  <li> Due to asynchronous file readings 'extra' figures may appear on board. It happens randomly, page refresh usually helps.
</ol>
