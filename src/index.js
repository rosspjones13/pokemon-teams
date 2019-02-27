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

  // Create pokemon list items to append to ul
  // trainer.pokemons.forEach(pokemon => {
    //   let li = document.createElement('li')
    //   li.innerText = pokemon.nickname + ` (${pokemon.species})`
    //   let releaseBtn = document.createElement('button')
    //   releaseBtn.className = "release"
    //   releaseBtn.innerText = "Release"
    
    //   // Append button to pokemon li and then li to ul
    //   li.appendChild(releaseBtn)
    //   ul.appendChild(li)
    // })
    
    // Append trainer elements to div
    div.append(p, addButton, ul)
    
    // Append whole trainer div to main
    main.append(div)
    trainer.pokemons.forEach(pokemon => renderPokemon(pokemon))
    
    // After element is visible add an event listener to add pokemon
    addButton.addEventListener('click', () => getPokemon(trainer))
  }
  
  // Adds a pokemon to the trainer on the server
  function getPokemon(trainer) {
    data = {trainer_id: trainer.id}
    fetch((getUrl() + 'pokemons'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(pokemon => renderPokemon(pokemon))
}

// Renders a trainers single pokemon
function renderPokemon(pokemon) {
  // Get ul to clear current list and append new full pokemon list 
  let ul = document.querySelector(`[data-trainer-id="${pokemon.trainer_id}"]`)
  // debugger

  // Grab all of trainers pokemon
  let li = document.createElement('li')
  li.innerText = pokemon.nickname + ` (${pokemon.species})`
  let releaseBtn = document.createElement('button')
  releaseBtn.className = "release"
  releaseBtn.innerText = "Release"

  // Append button to pokemon li and then li to ul
  li.appendChild(releaseBtn)
  ul.appendChild(li)
}

