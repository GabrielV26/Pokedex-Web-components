const pokeApi = {};

function convertPokeApiDetailToPokemon(pokemon) {
  const number = pokemon.id;
  const name = pokemon.name;
  const type = pokemon.types[0].type.name;
  const types = pokemon.types.map((type) => type.type.name);
  const photo = pokemon.sprites.front_default;

  return new Pokemon(number, name, type, types, photo);
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = function(offset = 0, limit = 20) {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequest) => Promise.all(detailRequest))
    .then((pokemonsDetails) => pokemonsDetails);
};

window.pokeApi = pokeApi;
