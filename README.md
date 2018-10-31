# Frontend Nanodegree Arcade Game
This is an arcade game created primarily using HTML5 canvas as part of the Udacity Frontend Nanodegree.
Visit the [live version](http://royshouvik.github.io/frontend-nanodegree-arcade-game/) to play the game.

## How to play
The objective of the game is to reach the water while avoiding bugs and collecting as many gems as possible.
Points scored for collecting gems are 50 for blue gem, 100 for green gem and 150 for orange gem.

You can move the player using `up` , `down` , `left` and `right` arrow keys on your keyboard. As such, this game 
doesn't support mobile browsers and can be played only on a desktop or laptop computer.

## Code Structure

- app.js

Initializes the player, enemies and collectibles.

- engine.js

Runs the main game loop, updates and renders player and other game objects. Also, plays the game background 
music and sound effects using [howler.js](https://github.com/goldfire/howler.js).

- resources.js

Loads the images used in the game and maintains a cache facility.


## License
The MIT License (MIT)

Copyright (c) [2016] [Shouvik Roy]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.  

