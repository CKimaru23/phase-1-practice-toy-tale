let collection = document.querySelector('#toy-collection');
const addToyBtn = document.querySelector('#new-toy-btn');
const addToyForm = document.querySelector('.container');


//fetching each from the fetchToys function that uses fetch method
//then for each toy, we create the elements using the showToys function
fetchToys().then((toys) => {
  toys.map((toy) => {
    showToys(toy) //Hoisting
  })
});

//function that gets the data from the API then
//the Response interface takes a Response stream and reads it to completion.
function fetchToys() {
  return fetch('http://localhost:3000/toys')
      .then(res => res.json())
}

//function that attaches the new toy input using the POST keyword and setting the initial like to 0
function attachToy(newData) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify({ //stringifying the information we post
      "name": newData.name.value,
      "image": newData.image.value,
      "likes": 0

    })
  })
      .then(res => res.json())
      .then((toyObject) => {
        let new_toy = showToys(toyObject)
        collection.append(new_toy)
      })
}

//function like
function likes(e) {
  e.preventDefault()
  let likePlus = parseInt(e.target.previousElementSibling.innerText) + 1 //adding a like in every like click

  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"

    },
    body: JSON.stringify({
      "likes": likePlus
    })
  })
      .then(res => res.json())
      .then((likeObj => {
        e.target.previousElementSibling.innerText = `${likePlus} likes`;
      }))
}

//Creating our toy structure, and inserting the data collected and transformed
function showToys(toy) {
  let h2El = document.createElement('h2') //h2 Element
  h2El.innerText = toy.name //mapping the name of the toy received into the h2 

  let imgEl = document.createElement('img')
  imgEl.setAttribute('src', toy.image)
  imgEl.setAttribute('class', 'toy-avatar')

  let pEl = document.createElement('p')
  pEl.innerText = `${toy.likes} likes`

  let btnEl = document.createElement('button')
  btnEl.setAttribute('class', 'like-btn')
  btnEl.setAttribute('id', toy.id)
  btnEl.innerText = "like"
  btnEl.addEventListener('click', (e) => {
    console.log(e.target.dataset);
    likes(e)
  })

  let card = document.createElement('div')
  card.setAttribute('class', 'card')
  card.append(h2El, imgEl, pEl, btnEl) //appending whatever we created to the card we created
  collection.append(card) //appending the card to our DOM with the id "toy-collection"
}


//Event listener to hide the button
let addNewToy;
addToyBtn.addEventListener('click', () => {
  addNewToy = !addNewToy;
  if (addNewToy) {
    addToyForm.style.display = 'block';
    addToyForm.addEventListener('submit', event => {
      event.preventDefault()
      attachToy(event.target)
    });
  } else {
    addToyForm.style.display = 'none';
  }
});


