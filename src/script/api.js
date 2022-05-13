document.addEventListener('DOMContentLoaded', function () {
const API_KEY = '65b5c49ad1a6d0579a80cb6ab026dfd8'
const pathImg = 'https://image.tmdb.org/t/p/w500/'
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
    .then(function (response) {
        const a = response.json()
       return a
    })
    .then(function (myJson) {
        console.log('myJson',myJson.results)
        renderFilms(myJson.results)
    })

    const templateFilmsList = (title, overview, releaseDate, poster) => `<li class="films__item"> <p class="films__name">${title}</p> <div class="card"> <div class="card__font"><img src="${pathImg}${poster}" alt="${title}"></div> <div class="card__back"> <p class="card__content">${overview}</p> </div> </div> <span class="films__release">${releaseDate}</span> </li>`

    const rootFilmsList = document.querySelector('.films__list--js')
    function renderFilms(filmsItems) {
        filmsItems.forEach(filmsItem => {
            const title = filmsItem.title
            const overview = filmsItem.overview
            const releaseDate = filmsItem.release_date
            const poster = filmsItem.poster_path
            const templateFilms = templateFilmsList(title, overview, releaseDate, poster)
            rootFilmsList.innerHTML += templateFilms
        })
    }


})