
class PokemonList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.loadPokemons();
    this.insertExternalCSSFiles([
      'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
      'assets/css/global.css',
      'assets/css/pokedex.css',
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;500;700&display=swap'
    ]);
  }
  
  async fetchExternalCSS(url) {
    const response = await fetch(url);
    const css = await response.text();
    return css;
  }

  async insertExternalCSS(url) {
    const css = await this.fetchExternalCSS(url);
    const styleElement = document.createElement('style');
    styleElement.innerHTML = css;
    this.shadowRoot.appendChild(styleElement);
  }

  async insertExternalCSSFiles(urls) {
    for (const url of urls) {
      await this.insertExternalCSS(url);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
      @import url('assets/css/global.css');
      @import url('assets/css/pokedex.css');
        
      .pokemons {
          display: grid;
          grid-template-columns: 1fr;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        /* Outros estilos... */

      </style>
      <ul id="pokemonList" class="pokemons"></ul>
      <button id="loadMoreButton">Load More</button>
    `;
  }

  // Restante do código...

  loadPokemons() {
    let offset = 0;
    const limit = 10;
    const pokemonList = this.shadowRoot.getElementById('pokemonList');
    const loadMoreButton = this.shadowRoot.getElementById('loadMoreButton');
    const maxRecords = 151; // Defina o valor correto para o número máximo de registros

    function convertPokemonToLi(pokemon) {
      return `
        <li class="pokemon ${pokemon.type}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>

          <div class="detail">
            <ol class="types">
              ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
          </div>
        </li>
      `;
    }
    
    loadMoreButton.addEventListener('click', () => {
      offset += limit;

      const qtdRecordWithNextPage = offset + limit;

      if (qtdRecordWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
      } else {
        loadPokemonItems(offset, limit);
      }
    });

    function loadPokemonItems(offset, limit) {
      pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
      });
    }

    loadPokemonItems(offset, limit);
  }
};
customElements.define('pokemon-list', PokemonList);