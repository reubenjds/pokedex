<!-- @format -->

<template>
	<div class="grid place-items-center grid-cols-3 flex-wrap">
		<div>
			<img
				class="h-390 w-363"
				src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" />
		</div>

		<div>
			<table class="table">
				<tbody>
					<tr>
						<th>Pokedex Number</th>
						<td>001</td>
					</tr>
					<tr>
						<th>Type</th>
						<td>Grass, Poison</td>
					</tr>
					<tr>
						<th>Height</th>
						<td>0.7 m (2′04″)</td>
					</tr>
					<tr>
						<th>Weight</th>
						<td>6.9 kg (15.2 lbs))</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="baseStats">
			<h2 class="PokemonStatTitle">Base Stats</h2>
			<p class="PokemonStat"><span class="statName">HP:</span> 45</p>
			<p class="PokemonStat"><span class="statName">Attack:</span> 49</p>
			<p class="PokemonStat"><span class="statName">Defense:</span> 49</p>
			<p class="PokemonStat"><span class="statName">Sp. Atk:</span> 65</p>
			<p class="PokemonStat"><span class="statName">Sp. Def:</span> 65</p>
			<p class="PokemonStat"><span class="statName">Speed:</span> 45</p>
			<div class="generalStats">
				<h2 class="PokemonStatTitle">General Stats</h2>
				<p class="PokemonStat">
					<span class="statName">Weight (kg):</span> 6.9
				</p>
				<p class="PokemonStat"><span class="statName">Height (m):</span> 0.7</p>
				<p class="PokemonStat"><span class="statName">Generation:</span> 1</p>
				<p class="PokemonStat">
					<span class="statName">Gender Ratio:</span>
					<span class="Male">88 </span><span class="Female">12</span>
				</p>
				<p class="PokemonStat">
					<span class="statName">Abilities:</span> Overgrow, Chlorophyll
				</p>
			</div>
		</div>
		<div grid grid-rows-2 flex-wrap>
			<div class="flex items-center justify-center">Strong Against</div>
			<div class="grid flex-wrap grid-cols-4 place-items-center">
				<h3 class="fire">FIRE</h3>
				<h3 class="flying">FLYING</h3>
				<h3 class="ice">ICE</h3>
				<h3 class="psychic">PSYCHIC</h3>
			</div>
			<div class="flex items-center justify-center">Weak Against</div>
			<div class="grid flex-wrap grid-cols-4 place-items-center">
				<div class="electric">ELECTRIC</div>
				<div class="fairy">FAIRY</div>
				<div class="fighting">FIGHTING</div>
				<div class="grass">GRASS</div>
				<div class="water">WATER</div>
			</div>
		</div>
	</div>
</template>
