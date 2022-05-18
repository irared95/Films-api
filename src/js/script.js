document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = '65b5c49ad1a6d0579a80cb6ab026dfd8'
    const PATH_IMG = 'https://image.tmdb.org/t/p/w500/'

    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
        .then((response) => response.json())
        .then((myJson) => renderFilms(myJson.results))

    const addZero = (number) => number < 10 ? `0${number}` : number

    function formatToDDMMYYYY(date) {
        let dateValue = new Date(date)
        let dd = dateValue.getDate();
        let mm = dateValue.getMonth() + 1;
        let yyyy = dateValue.getFullYear();
        return `${addZero(dd)}.${addZero(mm)}.${yyyy}`
    }

    const templateFilmsList = (title, overview, releaseDate, poster, rating) => `<li class="films__item"> <span class="films__rating">Rating:${rating}</span> <span class="films__release">${releaseDate}</span> <div class="card"> <div class="card__font"><img src="${PATH_IMG}${poster}" alt="${title}"></div> <div class="card__back"> <p class="card__content">${overview}</p> </div> </div> <p class="films__name">${title}</p>   </li>`

    const rootFilmsList = document.querySelector('.films__list--js')

    function renderFilms(filmsItems) {
        filmsItems.forEach(filmsItem => {
            const title = filmsItem.title
            const overview = filmsItem.overview
            const releaseDate = formatToDDMMYYYY(filmsItem.release_date)
            const poster = filmsItem.poster_path
            const rating = filmsItem.vote_average
            const templateFilms = templateFilmsList(title, overview, releaseDate, poster, rating)
            rootFilmsList.innerHTML += templateFilms
        })
    }


})
