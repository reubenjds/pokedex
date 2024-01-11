# pokedex

First generation Pokédex using MongoDB, Express.js, Vue.js and Node.js

## API

The API for this application is hosted on api.reubendsouza.com/pokemon

### Example Requests

1. Fetch paginated pokemon ordered by pokedex number

```bash
https://api.reubendsouza.com/pokemon?page=1

Example Reply:
[{"_id":"659df745b93a05e6e78a8e71","pokedexNumber":11,"name":"Metapod","evos":{"012":"Butterfree"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/metapod.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/011.png","types":["bug"],"isLegendary":false,"height":0.7,"weight":9.9,"malePercent":50,"femalePercent":50,"captureRate":120,"baseTotal":180,"baseStats":{"HP":"50","Attack":"20","Defense":"55","Special":"25","Speed":"30"},"maxStats":{"maxHealth":304,"maxAttack":152,"maxDefense":229,"maxSpAtk":163,"maxSpDef":163,"maxSpeed":174},"strongAgainst":["grass","fighting","ground"],"weakAgainst":["fire","poison","flying","rock"],"abilities":["Shed Skin"]},{"_id":"659df745b93a05e6e78a8e72","pokedexNumber":12,"name":"Butterfree","evos":{},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/butterfree.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/012.png","types":["bug","flying"],"isLegendary":false,"height":1.1,"weight":32,"malePercent":50,"femalePercent":50,"captureRate":45,"baseTotal":305,"baseStats":{"HP":"60","Attack":"45","Defense":"50","Special":"80","Speed":"70"},"maxStats":{"maxHealth":324,"maxAttack":207,"maxDefense":218,"maxSpAtk":306,"maxSpDef":284,"maxSpeed":262},"strongAgainst":["grass","fighting","ground"],"weakAgainst":["fire","electric","ice","poison","flying","rock"],"abilities":["Compoundeyes","Tinted Lens"]},{"_id":"659df745b93a05e6e78a8e73","pokedexNumber":13,"name":"Weedle","evos":{"014":"Kakuna","015":"Beedrill"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/weedle.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/013.png","types":["bug","poison"],"isLegendary":false,"height":0.3,"weight":3.2,"malePercent":50,"femalePercent":50,"captureRate":255,"baseTotal":175,"baseStats":{"HP":"40","Attack":"35","Defense":"30","Special":"20","Speed":"50"},"maxStats":{"maxHealth":284,"maxAttack":185,"maxDefense":174,"maxSpAtk":152,"maxSpDef":152,"maxSpeed":218},"strongAgainst":["grass","fighting"],"weakAgainst":["fire","flying","psychic","bug","rock"],"abilities":["Shield Dust","Run Away"]},{"_id":"659df745b93a05e6e78a8e74","pokedexNumber":14,"name":"Kakuna","evos":{"015":"Beedrill"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/kakuna.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/014.png","types":["bug","poison"],"isLegendary":false,"height":0.6,"weight":10,"malePercent":50,"femalePercent":50,"captureRate":120,"baseTotal":180,"baseStats":{"HP":"45","Attack":"25","Defense":"50","Special":"25","Speed":"35"},"maxStats":{"maxHealth":294,"maxAttack":163,"maxDefense":218,"maxSpAtk":163,"maxSpDef":163,"maxSpeed":185},"strongAgainst":["grass","fighting"],"weakAgainst":["fire","flying","psychic","bug","rock"],"abilities":["Shed Skin"]},{"_id":"659df745b93a05e6e78a8e75","pokedexNumber":15,"name":"Beedrill","evos":{},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/beedrill.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/015.png","types":["bug","poison"],"isLegendary":false,"height":1,"weight":29.5,"malePercent":50,"femalePercent":50,"captureRate":45,"baseTotal":305,"baseStats":{"HP":"65","Attack":"80","Defense":"40","Special":"45","Speed":"75"},"maxStats":{"maxHealth":334,"maxAttack":306,"maxDefense":196,"maxSpAtk":207,"maxSpDef":284,"maxSpeed":273},"strongAgainst":["grass","fighting"],"weakAgainst":["fire","flying","psychic","bug","rock"],"abilities":["Swarm","Sniper"]},{"_id":"659df745b93a05e6e78a8e76","pokedexNumber":16,"name":"Pidgey","evos":{"017":"Pidgeotto","018":"Pidgeot"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/pidgey.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/016.png","types":["normal","flying"],"isLegendary":false,"height":0.3,"weight":1.8,"malePercent":50,"femalePercent":50,"captureRate":255,"baseTotal":216,"baseStats":{"HP":"40","Attack":"45","Defense":"40","Special":"35","Speed":"56"},"maxStats":{"maxHealth":284,"maxAttack":207,"maxDefense":196,"maxSpAtk":185,"maxSpDef":185,"maxSpeed":232},"strongAgainst":["grass","ground","bug","ghost"],"weakAgainst":["electric","ice","rock"],"abilities":["Keen Eye","Tangled Feet","Big Pecks"]},{"_id":"659df745b93a05e6e78a8e77","pokedexNumber":17,"name":"Pidgeotto","evos":{"018":"Pidgeot"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/pidgeotto.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/017.png","types":["normal","flying"],"isLegendary":false,"height":1.1,"weight":30,"malePercent":50,"femalePercent":50,"captureRate":120,"baseTotal":299,"baseStats":{"HP":"63","Attack":"60","Defense":"55","Special":"50","Speed":"71"},"maxStats":{"maxHealth":330,"maxAttack":240,"maxDefense":229,"maxSpAtk":218,"maxSpDef":218,"maxSpeed":265},"strongAgainst":["grass","ground","bug","ghost"],"weakAgainst":["electric","ice","rock"],"abilities":["Keen Eye","Tangled Feet","Big Pecks"]},{"_id":"659df745b93a05e6e78a8e78","pokedexNumber":18,"name":"Pidgeot","evos":{},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/pidgeot.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/018.png","types":["normal","flying"],"isLegendary":false,"height":1.5,"weight":39.5,"malePercent":50,"femalePercent":50,"captureRate":45,"baseTotal":399,"baseStats":{"HP":"83","Attack":"80","Defense":"75","Special":"70","Speed":"91"},"maxStats":{"maxHealth":370,"maxAttack":284,"maxDefense":273,"maxSpAtk":262,"maxSpDef":262,"maxSpeed":331},"strongAgainst":["grass","ground","bug","ghost"],"weakAgainst":["electric","ice","rock"],"abilities":["Keen Eye","Tangled Feet","Big Pecks"]},{"_id":"659df745b93a05e6e78a8e79","pokedexNumber":19,"name":"Rattata","evos":{"020":"Raticate"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/rattata.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/019.png","types":["normal"],"isLegendary":false,"height":0.3,"weight":3.5,"malePercent":50,"femalePercent":50,"captureRate":255,"baseTotal":218,"baseStats":{"HP":"30","Attack":"56","Defense":"35","Special":"25","Speed":"72"},"maxStats":{"maxHealth":264,"maxAttack":232,"maxDefense":185,"maxSpAtk":163,"maxSpDef":185,"maxSpeed":267},"strongAgainst":["ghost"],"weakAgainst":["fighting"],"abilities":["Run Away","Guts","Hustle","Gluttony","Hustle","Thick Fat"]},{"_id":"659df745b93a05e6e78a8e7a","pokedexNumber":20,"name":"Raticate","evos":{},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/raticate.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/020.png","types":["normal"],"isLegendary":false,"height":0.7,"weight":18.5,"malePercent":50,"femalePercent":50,"captureRate":127,"baseTotal":343,"baseStats":{"HP":"55","Attack":"81","Defense":"60","Special":"50","Speed":"97"},"maxStats":{"maxHealth":314,"maxAttack":287,"maxDefense":240,"maxSpAtk":218,"maxSpDef":262,"maxSpeed":322},"strongAgainst":["ghost"],"weakAgainst":["fighting"],"abilities":["Run Away","Guts","Hustle","Gluttony","Hustle","Thick Fat"]}]
```

2. Request Pokemon by pokedex number

```bash
https://api.reubendsouza.com/pokemon/1

Example Reply:
{"_id":"659df745b93a05e6e78a8e67","pokedexNumber":1,"name":"Bulbasaur","evos":{"002":"Ivysaur","003":"Venusaur"},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/bulbasaur.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png","types":["grass","poison"],"isLegendary":false,"height":0.7,"weight":6.9,"malePercent":87.5,"femalePercent":12.5,"captureRate":45,"baseTotal":253,"baseStats":{"HP":"45","Attack":"49","Defense":"49","Special":"65","Speed":"45"},"maxStats":{"maxHealth":294,"maxAttack":216,"maxDefense":216,"maxSpAtk":251,"maxSpDef":251,"maxSpeed":207},"strongAgainst":["water","electric","fighting"],"weakAgainst":["fire","ice","flying","psychic","bug"],"abilities":["Overgrow","Chlorophyll"]}
```

3. Request Pokemon by name

```bash
https://api.reubendsouza.com/pokemon/search?name=mew

Example Reply:
[{"_id":"659df745b93a05e6e78a8efc","pokedexNumber":150,"name":"Mewtwo","evos":{},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/mewtwo.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png","types":["psychic"],"isLegendary":true,"height":2,"weight":122,"malePercent":0,"femalePercent":0,"captureRate":3,"baseTotal":590,"baseStats":{"HP":"106","Attack":"110","Defense":"90","Special":"154","Speed":"130"},"maxStats":{"maxHealth":416,"maxAttack":350,"maxDefense":306,"maxSpAtk":447,"maxSpDef":306,"maxSpeed":394},"strongAgainst":["fighting","ghost"],"weakAgainst":["bug"],"abilities":["Pressure","Unnerve"]},{"_id":"659df745b93a05e6e78a8efd","pokedexNumber":151,"name":"Mew","evos":{},"spriteSmallLink":"https://img.pokemondb.net/sprites/sword-shield/icon/mew.png","spriteBigLink":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/151.png","types":["psychic"],"isLegendary":true,"height":0.4,"weight":4,"malePercent":0,"femalePercent":0,"captureRate":45,"baseTotal":500,"baseStats":{"HP":"100","Attack":"100","Defense":"100","Special":"100","Speed":"100"},"maxStats":{"maxHealth":404,"maxAttack":328,"maxDefense":328,"maxSpAtk":328,"maxSpDef":328,"maxSpeed":328},"strongAgainst":["fighting","ghost"],"weakAgainst":["bug"],"abilities":["Synchronize"]}]
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io)
- [MongoDB](https://www.mongodb.com/)

### Setup

1. Clone the repository

```bash
git clone https://github.com/reubenjds/pokedex
```

2. Install dependencies

```bash
cd pokedex
pnpm install
```

3. Build the project

```bash
pnpm build
```

### Hosting your own API

Optionally, you can choose to host your own API.

1. Install server dependencies

```bash
cd pokedex/server
pnpm install
```

2. In the server directory, copy the `.env.example` file to `.env` and fill in the required values

   For ease of use, [pokemon.json](https://github.com/reubenjds/pokedex/blob/main/scripts/pokemon.json) can be imported into MongoDB; name the collection 'generation1'.

3. Inside `pokemon/utils/client.ts` change `baseURL` to 'http://localhost:4040' (server is set to listen to port 4040 by default)

4. Start the server

```bash
pnpm devStart
```
