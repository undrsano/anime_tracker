export const translations = {
  genres: {
    'Action': 'Боевик',
    'Adventure': 'Приключения',
    'Comedy': 'Комедия',
    'Drama': 'Драма',
    'Fantasy': 'Фэнтези',
    'Horror': 'Ужасы',
    'Mystery': 'Мистика',
    'Romance': 'Романтика',
    'Sci-Fi': 'Научная фантастика',
    'Slice of Life': 'Повседневность',
    'Sports': 'Спорт',
    'Supernatural': 'Сверхъестественное',
    'Thriller': 'Триллер',
    'Psychological': 'Психология',
    'Historical': 'Исторический',
    'Military': 'Военный',
    'Mecha': 'Меха',
    'Music': 'Музыка',
    'Parody': 'Пародия',
    'Samurai': 'Самураи',
    'School': 'Школа',
    'Shoujo': 'Сёдзё',
    'Shounen': 'Сёнен',
    'Space': 'Космос',
    'Super Power': 'Суперсила',
    'Vampire': 'Вампиры',
    'Demons': 'Демоны',
    'Magic': 'Магия',
    'Martial Arts': 'Боевые искусства',
    'Police': 'Полиция',
    'Game': 'Игры',
    'Cars': 'Гонки',
    'Josei': 'Дзёсэй',
    'Seinen': 'Сэйнэн',
    'Kids': 'Детский',
    'Harem': 'Гарем',
    'Ecchi': 'Этти',
    'Hentai': 'Хентай',
    'Yaoi': 'Яой',
    'Yuri': 'Юри',
    'Isekai': 'Исэкай',
    'Cooking': 'Кулинария',
    'Gourmet': 'Гурман',
    'Work Life': 'Работа',
    'Award Winning': 'Лауреат премий',
    'Avant Garde': 'Авангард',
    'Boys Love': 'Любовь мальчиков',
    'Girls Love': 'Любовь девочек',
    'Gore': 'Кровь',
    'Mahou Shoujo': 'Магические девочки',
    'Mythology': 'Мифология',
    'Shoujo Ai': 'Сёдзё-ай',
    'Shounen Ai': 'Сёнен-ай'
  },

  status: {
    'FINISHED': 'Завершено',
    'RELEASING': 'Выпускается',
    'NOT_YET_RELEASED': 'Не выпущено',
    'CANCELLED': 'Отменено',
    'HIATUS': 'Приостановлено'
  },

  seasons: {
    'WINTER': 'Зима',
    'SPRING': 'Весна',
    'SUMMER': 'Лето',
    'FALL': 'Осень'
  },

  userStatus: {
    'WATCHING': 'Смотрю',
    'PLANNED': 'Запланировано',
    'WATCHED': 'Просмотрено',
    'DROPPED': 'Брошено',
    'REWATCHING': 'Пересматриваю'
  },

  translateGenre(genre: string): string {
    return this.genres[genre as keyof typeof this.genres] || genre;
  },

  translateStatus(status: string): string {
    return this.status[status as keyof typeof this.status] || status;
  },

  translateSeason(season: string): string {
    return this.seasons[season as keyof typeof this.seasons] || season;
  },

  translateUserStatus(status: string): string {
    return this.userStatus[status as keyof typeof this.userStatus] || status;
  },

  translateGenres(genres: string[]): string[] {
    return genres.map(genre => this.translateGenre(genre));
  }
}; 