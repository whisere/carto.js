var carto = require('../../../../../src/api/v4');

describe('api/v4/source/dataset', function () {
  describe('constructor', function () {
    it('should return a new Dataset object', function () {
      var populatedPlacesDataset = new carto.source.Dataset('ne_10m_populated_places_simple');
      expect(populatedPlacesDataset).toBeDefined();
    });

    it('should autogenerate an id when no ID is given', function () {
      var populatedPlacesDataset = new carto.source.Dataset('ne_10m_populated_places_simple');
      expect(populatedPlacesDataset.getId()).toMatch(/S\d+/);
    });

    it('should throw an error if dataset is not provided', function () {
      expect(function () {
        new carto.source.Dataset(); // eslint-disable-line
      }).toThrowError('dataset is required.');
    });

    it('should throw an error if dataset is empty', function () {
      expect(function () {
        new carto.source.Dataset(''); // eslint-disable-line
      }).toThrowError('dataset is required.');
    });

    it('should throw an error if dataset is not a valid string', function () {
      expect(function () {
        new carto.source.Dataset(3333); // eslint-disable-line
      }).toThrowError('dataset must be a string.');
    });
  });

  describe('$setEngine', function () {
    it('should create an internal model with the dataset and the engine', function () {
      var populatedPlacesDataset = new carto.source.Dataset('ne_10m_populated_places_simple');

      populatedPlacesDataset.$setEngine('fakeEngine');

      var internalModel = populatedPlacesDataset.$getInternalModel();
      expect(internalModel.get('id')).toEqual(populatedPlacesDataset.getId());
      expect(internalModel.get('query')).toEqual('SELECT * from ne_10m_populated_places_simple');
      expect(internalModel._engine).toEqual('fakeEngine');
    });
  });
});