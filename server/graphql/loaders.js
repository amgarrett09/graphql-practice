const DataLoader = require('dataloader');
const { knex } = require('../db');

module.exports = {
  directorByID: new DataLoader(async (ids) => {
    const result = await knex('directors')
      .select()
      .whereIn('id', ids);

    return ids.map(id => result.find(obj => obj.id === id));
  }),
  moviesByDirectorID: new DataLoader(async (ids) => {
    const result = await knex('movies')
      .select()
      .whereIn('director_id', ids);

    return ids.map(id => result.filter(obj => obj.director_id === id));
  }),
};
