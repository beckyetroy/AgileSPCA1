import './commands';

//Filtering
export const filterByTitle = (movieList, string) =>
  movieList.filter((m) => m.title.toLowerCase().search(string) !== -1);

export const filterByGenre = (movieList, genres) =>
  movieList.filter((m) => m.genre_ids.some(id => genres.includes(id)));

export const filterByName = (personList, string) =>
  personList.filter((c) => {
    return c.name.toLowerCase().search(string.toLowerCase()) !== -1;
  });

export const filterByCharacter = (castList, string) =>
  castList.filter((c) => {
    return c.character.toLowerCase().search(string.toLowerCase()) !== -1;
  });

export const filterByJob = (castList, string) =>
  castList.filter((c) => {
    return c.job.toLowerCase().search(string.toLowerCase()) !== -1;
  });

//Sorting
//Very good storting solution
export const sortItemsLargeFirst = (list, sortType) =>
  list.sort((i1, i2) => (
    (i1[sortType] < i2[sortType]) ? 1 : (i1[sortType] > i2[sortType]) ? -1 : 0
));

export const sortItemsSmallFirst = (list, sortType) =>
  list.sort((i1, i2) => (
    (i1[sortType] > i2[sortType]) ? 1 : (i1[sortType] < i2[sortType]) ? -1 : 0
));