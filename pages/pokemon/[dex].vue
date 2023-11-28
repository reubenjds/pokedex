<script setup lang="ts">
import axios from "axios";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const { dex } = useRoute().params;

const pokemon = ref<Pokemon>();
const error = ref("");

async function getPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon/${dex}`);
		pokemon.value = response.data;
		console.log(response.data);
	} catch (e) {
		error.value = (e as any).message;
	}
}

onMounted(() => getPokemon());
</script>

<template>
	<div class="flex flex-wrap items-center justify-center h-screen relative">
		<div class="flex flex-wrap place-items-center gap-x-20 gap-y-5 items-center justify-center">
			<div>

				<img class="h-390 w-363" :src="pokemon?.spriteBigLink" />
			</div>

			<div>
				<h1 class="text-3xl font-bold text-white w-full text-center">
					{{ pokemon?.name }}
				</h1>
				<table class="table">

					<tbody>
						<tr>
							<th>Pokedex Number</th>
							<td>{{ pokemon?.pokedexNumber }}</td>
						</tr>
						<tr>
							<th>Type</th>
							<td>
								<span v-for="type in pokemon?.types" class="px-2 uppercase" :class="type">{{ type }}</span>
							</td>
						</tr>
						<tr>
							<th>Height</th>
							<td>{{ pokemon?.height }} m</td>
						</tr>
						<tr>
							<th>Weight</th>
							<td>{{ pokemon?.weight }} kg</td>
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
							<td>{{ pokemon?.baseStats.HP }}</td>
							<td>

								<progress class="progress progress-success w-56" :value="pokemon?.baseStats.HP"
									:max="pokemon?.maxStats.maxHealth"></progress>

							</td>
							<td>{{ pokemon?.maxStats.maxHealth }}</td>
						</tr>
						<tr>
							<th>Attack:</th>
							<td>{{ pokemon?.baseStats.Attack }}</td>
							<td>

								<progress class="progress progress-error w-56" :value="pokemon?.baseStats.Attack"
									:max="pokemon?.maxStats.maxAttack"></progress>
							</td>
							<td>{{ pokemon?.maxStats.maxAttack }}</td>
						</tr>
						<tr>
							<th>Defense:</th>
							<td>{{ pokemon?.baseStats.Defense }}</td>
							<td>

								<progress class="progress progress-info w-56" :value="pokemon?.baseStats.Defense"
									:max="pokemon?.maxStats.maxDefense"></progress>

							</td>
							<td>{{ pokemon?.maxStats.maxDefense }}</td>
						</tr>
						<tr>
							<th>Special:</th>
							<td>{{ pokemon?.baseStats.Special }}</td>
							<td>

								<progress class="progress progress-secondary w-56" :value="pokemon?.baseStats.Special"
									:max="pokemon?.maxStats.maxSpAtk"></progress>

							</td>
							<td>{{ pokemon?.maxStats.maxSpAtk }}</td>
						</tr>
						<tr>
							<th>Speed:</th>
							<td>{{ pokemon?.baseStats.Speed }}</td>
							<td>
								<progress class="progress progress-warning w-56" :value="pokemon?.baseStats.Speed"
									:max="pokemon?.maxStats.maxSpeed"></progress>
							</td>
							<td>{{ pokemon?.maxStats.maxSpeed }}</td>
						</tr>
						<tr>
							<th>Total:</th>
							<td class="font-bold text-white">
								{{ pokemon?.baseTotal }}
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
					<div v-for="type in pokemon?.strongAgainst" :class="type"> {{ type }}</div>
				</div>
				<div class="flex items-center justify-center font-bold text-white">
					Weak Against
				</div>
				<div class="flex flex-wrap justify-center">
					<div v-for="type in pokemon?.weakAgainst" :class="type"> {{ type }}</div>
				</div>
			</div>

			<div>
				<h2 class=" font-bold text-white">General Information</h2>
				<table class="table">
					<tbody>
						<tr>
							<th>Evolutions:</th>
							<td>
								<div class="flex flex-wrap items-center justify-center">
									<a v-for="(value, key) in pokemon?.evos" :key="key" :href="`${key}`"><img
											class="hover:scale-125 transition-all duration-500 ease-in-out"
											:src="`https://img.pokemondb.net/sprites/sword-shield/icon/${(value as string).toLowerCase()}.png`" /></a>

								</div>
							</td>
						</tr>
						<tr>
							<th>Capture Rate:</th>
							<td>{{ pokemon?.captureRate }}%</td>
						</tr>
						<tr>
							<th>Gender Ratio:</th>
							<td>
								<span class="text-blue-400"> {{ pokemon?.malePercent }} </span>
								<span>-</span>
								<span class="text-pink-400"> {{ pokemon?.femalePercent }}</span>
							</td>
						</tr>
						<tr>
							<th>Abilities:</th>
							<td>
								<div v-for="ability in pokemon?.abilities">{{ ability }}</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
