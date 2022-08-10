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

    const iconFavorites = '<svg height="24px" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg""><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"/></svg>'
    const templateFilmsList = (id, title, overview, releaseDate, poster, rating, existFilmInFavorites) => `<li class="films__item films__item--js" data-id="${id}"> <span class="films__rating">Rating:${rating}</span> <span class="films__release">${releaseDate}</span> <div class="card card--js" > <div class="card__front"><img src="${poster}" alt="${title}"></div> <div class="card__back card__back--js"><div class="card__inner"><p class="card__favorites ${existFilmInFavorites ? 'active' : ''} ">${iconFavorites}</p><p class="card__content">${overview}</p></div></div> </div> <p class="films__name">${title}</p>   </li>`
    const rootFilmsList = document.querySelector('.films__list--js')

    function renderFilms(filmsItems) {
        const favoritesFilms = store.favoritesFilms
        filmsItems.forEach(filmsItem => {
            const title = filmsItem.title
            const overview = filmsItem.overview
            const releaseDate = formatToDDMMYYYY(filmsItem.release_date)
            const poster = filmsItem.poster_path ? `${PATH_IMG}${filmsItem.poster_path}` : PLACEHOLDER_NO_IMAGE
            const rating = filmsItem.vote_average
            const id = filmsItem.id
            //сущесвутет ли айди в лайкнутых фильмах
            const existFilmInFavorites =  favoritesFilms.includes(id.toString())
            const templateFilms = templateFilmsList(id, title, overview, releaseDate, poster, rating, existFilmInFavorites)
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

    function deleteTextNoFilms() {
        const deleteText = document.querySelector('.empty-films--js')
        if (deleteText) deleteText.remove()
    }

    document.addEventListener('click', function (e) {
        if (e.target.className.includes('card__favorites')) {
            const id = e.target.closest('.films__item--js').getAttribute('data-id')
            addFavorites(id)
            //закрашивание звездочки
            e.target.classList.toggle('active')
        }
    })

    const store = {
        favoritesFilms: JSON.parse(localStorage.getItem('favoritesFilms')) || [] //получаем фильмы
    }
   //срабатывает при клике
    function addFavorites(id) {
        const favoritesFilms = store.favoritesFilms   //деструктуризация иначе store.films
        const existFilm = favoritesFilms.includes(id) //содержит ли массив лайкнутое айди, возвращает true или false.
        if (!existFilm){ // если нет
            favoritesFilms.push(id) // то его добавляем в массив
        } else{
           // иначе удаляем с массива
            const findFilmIndex = favoritesFilms.findIndex(filmId => {
                return filmId === id
            })
            favoritesFilms.splice(findFilmIndex, 1 )
        }
        localStorage.setItem('favoritesFilms', JSON.stringify(favoritesFilms)); // сохранение в браузере выбранных фильмов
    }

})

