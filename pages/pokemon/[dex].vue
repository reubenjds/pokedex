<script setup lang="ts">
import axios from "axios";
import { useRoute } from "vue-router";

const { dex } = useRoute().params;

async function getPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon/${dex}`);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

getPokemon(); // get
</script>

<template>
	<div class="flex flex-wrap items-center justify-center h-screen">
		<div class="flex flex-wrap place-items-center gap-x-20 gap-y-5 items-center justify-center">
			<div class="relative">
				<h1 class="absolute text-3xl font-bold text-white top-5 left-5">
					Bulbasaur
				</h1>
				<img class="h-390 w-363" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" />
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
							<td>
								<span class="grass px-2">GRASS</span>
								<span class="poison px-2">POISON</span>
							</td>
						</tr>
						<tr>
							<th>Height</th>
							<td>0.7 m (2′04″)</td>
						</tr>
						<tr>
							<th>Weight</th>
							<td>6.9 kg (15.2 lbs)</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h2 class="font-bold text-white">Base Stats</h2>
				<table class="table">
					<tbody>
						<tr>
							<th>HP:</th>
							<td>
								45
								<progress class="progress progress-success w-56" value="100" max="100"></progress>
							</td>
						</tr>
						<tr>
							<th>Attack:</th>
							<td>
								49
								<progress class="progress progress-error w-56" value="100" max="100"></progress>
							</td>
						</tr>
						<tr>
							<th>Defense:</th>
							<td>
								49
								<progress class="progress progress-info w-56" value="100" max="100"></progress>
							</td>
						</tr>
						<tr>
							<th>Sp. Atk:</th>
							<td>
								65
								<progress class="progress progress-secondary w-56" value="100" max="100"></progress>
							</td>
						</tr>
						<tr>
							<th>Sp. Def:</th>
							<td>
								65
								<progress class="progress progress-primary w-56" value="100" max="100"></progress>
							</td>
						</tr>
						<tr>
							<th>Speed:</th>
							<td>
								45
								<progress class="progress progress-warning w-56" value="100" max="100"></progress>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div></div>
			<div class="grid grid-rows-2 flex-wrap px-2 place-items-center">
				<div class="flex items-center justify-center font-bold text-white">
					Strong Against
				</div>
				<div class="flex flex-wrap justify-center">
					<div class="fire">FIRE</div>
					<div class="flying">FLYING</div>
					<div class="ice">ICE</div>
					<div class="psychic">PSYCHIC</div>
				</div>
				<div class="flex items-center justify-center font-bold text-white">
					Weak Against
				</div>
				<div class="flex flex-wrap justify-center">
					<div class="electric">ELECTRIC</div>
					<div class="fairy">FAIRY</div>
					<div class="fighting">FIGHTING</div>
					<div class="grass">GRASS</div>
					<div class="water">WATER</div>
				</div>
			</div>

			<div>
				<h2>General Information</h2>
				<table class="table">
					<tbody>
						<tr>
							<th>Evolutions:</th>
							<td>
								<div class="flex flex-wrap items-center justify-center">
									<img class="hover:scale-125 transition-all duration-500 ease-in-out"
										src="https://img.pokemondb.net/sprites/sword-shield/icon/ivysaur.png" />
									<img class="hover:scale-125 transition-all duration-500 ease-in-out"
										src="https://img.pokemondb.net/sprites/sword-shield/icon/venusaur.png" />
								</div>
							</td>
						</tr>
						<tr>
							<th>Capture Rate:</th>
							<td>45%</td>
						</tr>
						<tr>
							<th>Gender Ratio:</th>
							<td>
								<span class="text-blue-400">88 </span>
								<span class="text-pink-400">12</span>
							</td>
						</tr>
						<tr>
							<th>Abilities:</th>
							<td>Overgrow, Chlorophyll</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
