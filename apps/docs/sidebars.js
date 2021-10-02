const setPrefix = (prefix, docs) => {
  return docs.map((doc) => `${prefix}/${doc}`);
};

module.exports = {
  docs: [
    {
      Introduction: setPrefix('introduction', ['intro', 'installation']),
      Features: setPrefix('features', ['commander', 'inquirer', 'factory', 'plugins']),
      Testing: setPrefix('testing', ['installation', 'factory']),
      Schematics: setPrefix('schematics', ['installation', 'usage']),
    },
    'executing/local',
    'api',
  ],
};
