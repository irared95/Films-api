document.addEventListener('DOMContentLoaded', function () {
    const PLACEHOLDER_NO_IMAGE = 'https://www.cronobierzo.es/wp-content/uploads/2020/01/no-image.jpg'
    const API_KEY = '65b5c49ad1a6d0579a80cb6ab026dfd8'
    const PATH_IMG = 'https://image.tmdb.org/t/p/w500/'
    const TEXT_NO_FILMS = 'Not found films'

    function searchFilmsApi() {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${inputSearch.value}`)
            .then((response) => response.json())
            .then((myJson) => {
                deleteFilms()
                deleteTextNoFilms()
                if (myJson.results.length) {
                    renderFilms(myJson.results)
                } else {
                    renderNoFilms()
                }


            })
    }

   function popularFilmsApi() {
       fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
           .then((response) => response.json())
           .then((myJson) => {
               deleteFilms()
               deleteTextNoFilms()
               renderFilms(myJson.results)
           })
   }

    popularFilmsApi()

    const buttonSearch = document.querySelector('.search__button--js')
    const inputSearch = document.querySelector('.search__input--js')

    buttonSearch.addEventListener('click', function () {
        if (!inputSearch.value.trim()) popularFilmsApi()
        if (inputSearch.value.trim()) searchFilmsApi()
    })
    inputSearch.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchFilmsApi()
        }

    });

    const addZero = (number) => number < 10 ? `0${number}` : number

    function formatToDDMMYYYY(date) {
        let dateValue = new Date(date)
        let dd = dateValue.getDate();
        let mm = dateValue.getMonth() + 1;
        let yyyy = dateValue.getFullYear();
        return `${addZero(dd)}.${addZero(mm)}.${yyyy}`
    }

    const templateFilmsList = (title, overview, releaseDate, poster, rating) => `<li class="films__item films__item--js"> <span class="films__rating">Rating:${rating}</span> <span class="films__release">${releaseDate}</span> <div class="card"> <div class="card__font"><img src="${poster}" alt="${title}"></div> <div class="card__back"> <p class="card__content">${overview}</p> </div> </div> <p class="films__name">${title}</p>   </li>`

    const rootFilmsList = document.querySelector('.films__list--js')

    function renderFilms(filmsItems) {
        filmsItems.forEach(filmsItem => {
            const title = filmsItem.title
            const overview = filmsItem.overview
            const releaseDate = formatToDDMMYYYY(filmsItem.release_date)
            const poster = filmsItem.poster_path ? `${PATH_IMG}${filmsItem.poster_path}` : PLACEHOLDER_NO_IMAGE
            const rating = filmsItem.vote_average
            const templateFilms = templateFilmsList(title, overview, releaseDate, poster, rating)
            rootFilmsList.innerHTML += templateFilms
        })
    }


    const templateNoFilms = (text) => `<p class="empty-films empty-films--js">${text}</p>`

    const rootNoFilms = document.querySelector('.root-empty-films--js')

    function renderNoFilms() {
        const renderedNoFilms = templateNoFilms(TEXT_NO_FILMS)
        rootNoFilms.innerHTML += renderedNoFilms
    }


    function deleteFilms() {
        const filmsItems = document.querySelectorAll('.films__item--js')
        if (filmsItems.length) {
            filmsItems.forEach(filmsItem => {
                filmsItem.remove()
            })

        }
    }

    function deleteTextNoFilms(){
        const deleteText = document.querySelector('.empty-films--js')
        if (deleteText) deleteText.remove()

    }




})

