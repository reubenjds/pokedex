<!-- @format -->
<style>
	div {
		color: white;
		font-weight: bold;
	}
</style>
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
		<div>
			<h2>Base Stats</h2>
			<p>HP: 45</p>
			<p>Attack: 49</p>
			<p>Defense: 49</p>
			<p>Sp. Atk: 65</p>
			<p>Sp. Def: 65</p>
			<p>Speed: 45</p>
		</div>
		<div></div>
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

		<div>
			<h2>General Stats</h2>
			<p>Weight (kg): 6.9</p>
			<p>Height (m): 0.7</p>
			<p>Generation: 1</p>
			<p>Gender Ratio: 88 12</p>
			<p>Abilities: Overgrow, Chlorophyll</p>
		</div>
	</div>
</template>
