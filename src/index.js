//solution goes here
document.addEventListener("DOMContentLoaded", init)

// Returns server url
function getUrl() {
  return 'http://localhost:3000/'
}

// After DOM loaded
function init() {
  getAllTrainers()
}

// Get trainers from server
function getAllTrainers() {
  fetch(getUrl() + 'trainers')
    .then(res => res.json())
    .then(trainers => trainers.forEach(trainer => renderTrainer(trainer)))
}

// Render each trainer
function renderTrainer(trainer) {
  // Grab main tag
  let main = document.querySelector('main')
  
  // Create div and inner elements
  let div = document.createElement('div')
  div.className = "card"
  let p = document.createElement('p')
  p.innerText = trainer.name
  let addButton = document.createElement('button')
  addButton.innerText = "Add Pokemon"
  let ul = document.createElement('ul')
  ul.dataset.trainerId = trainer.id

  // Append trainer elements to div
  div.append(p, addButton, ul)
  
  // Append whole trainer div to main
  main.append(div)

  // Create pokemon list items to append to ul
  trainer.pokemons.forEach(pokemon => renderPokemon(pokemon))
  
  // After element is visible add an event listener to add pokemon
  addButton.addEventListener('click', () => {
    getPokemon(trainer)
  })
}
  
// Adds a pokemon to the trainer on the server
function getPokemon(trainer) {
  // Find ul to count children
  let ul = document.querySelector(`[data-trainer-id="${trainer.id}"]`)

  // Data to be inserted
  let data = {trainer_id: trainer.id}

  // Only add a pokemon if the trainer has less than 6 on their team
  if (ul.childElementCount < 6){
    fetch((getUrl() + 'pokemons'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(pokemon => renderPokemon(pokemon))
  } else {
    alert("You already have 6 Pokemon! Release a Pokemon first.")
  }
}

// Renders a trainers single pokemon
function renderPokemon(pokemon) {
  // Get ul to clear current list and append new full pokemon list 
  let ul = document.querySelector(`[data-trainer-id="${pokemon.trainer_id}"]`)

  // Grab all of trainers pokemon
  let li = document.createElement('li')
  li.innerText = pokemon.nickname + ` (${pokemon.species})`
  li.dataset.pokemonId = pokemon.id
  let releaseBtn = document.createElement('button')
  releaseBtn.className = "release"
  releaseBtn.innerText = "Release"

  // Append button to pokemon li and then li to ul
  li.appendChild(releaseBtn)
  ul.appendChild(li)

  // After release element is visible add release event listener
  releaseBtn.addEventListener('click', () => {
    releasePokemon(pokemon)
  })
}

// First remove the DOM element then remove the 
function releasePokemon(pokemon) {
  // Optimistic clearing of DOM pokemon item
  let pokemonListItem = document.querySelector(`[data-pokemon-id="${pokemon.id}"]`)
  let pokemonList = pokemonListItem.parentElement

  // Find the current pokemon li item and remove it
  pokemonList.childNodes.forEach(node => {
    if (node === pokemonListItem) {
      pokemonList.removeChild(node)
    }
  })

  // Removing pokemon on server end
  fetch((getUrl() + 'pokemons/' + pokemon.id),{
    method: "DELETE"
  })
    .then(res => res.json())
    .then(console.log(`pokemon ${pokemon.nickname} (${pokemon.species}) successfully deleted`))
}