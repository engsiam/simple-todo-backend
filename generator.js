const fs = require('fs');
const path = require('path');

const modelName = process.argv[2];
if (!modelName) {
  console.error('Please provide a model name.');
  process.exit(1);
}

const pascalCaseName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
const camelCaseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);

// Paths
const modelDir = path.join(__dirname, './models');
const controllerDir = path.join(__dirname, './controllers');
const routeDir = path.join(__dirname, './routes');

const modelPath = path.join(modelDir, `${camelCaseName}.js`);
const controllerPath = path.join(controllerDir, `${camelCaseName}Controller.js`);
const routePath = path.join(routeDir, `${camelCaseName}Routes.js`);

// Ensure directories exist
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

if (!fs.existsSync(controllerDir)) {
  fs.mkdirSync(controllerDir, { recursive: true });
}

if (!fs.existsSync(routeDir)) {
  fs.mkdirSync(routeDir, { recursive: true });
}

// Model Template
const modelTemplate = `
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ${camelCaseName}Schema = new Schema({
  // Define your schema here
  name: {
    type: String,
    required: true
  },
  // Add more fields as needed
});

module.exports = mongoose.model('${pascalCaseName}', ${camelCaseName}Schema);
`;

// Controller Template
const controllerTemplate = `
const ${pascalCaseName} = require('../models/${camelCaseName}');

// Create a new ${modelName}
exports.create = (req, res) => {
  const ${camelCaseName} = new ${pascalCaseName}(req.body);
  ${camelCaseName}.save((err, ${camelCaseName}) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(201).send(${camelCaseName});
  });
};

// Get all ${modelName}s
exports.findAll = (req, res) => {
  ${pascalCaseName}.find((err, ${camelCaseName}s) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).send(${camelCaseName}s);
  });
};

// Get a single ${modelName} by ID
exports.findOne = (req, res) => {
  ${pascalCaseName}.findById(req.params.id, (err, ${camelCaseName}) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).send(${camelCaseName});
  });
};

// Update a ${modelName} by ID
exports.update = (req, res) => {
  ${pascalCaseName}.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, ${camelCaseName}) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).send(${camelCaseName});
  });
};

// Delete a ${modelName} by ID
exports.delete = (req, res) => {
  ${pascalCaseName}.findByIdAndRemove(req.params.id, (err, ${camelCaseName}) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).send({ message: '${pascalCaseName} deleted successfully' });
  });
};
`;

// Route Template
const routeTemplate = `
const express = require('express');
const router = express.Router();
const ${camelCaseName}Controller = require('../controllers/${camelCaseName}Controller');

router.post('/', ${camelCaseName}Controller.create);
router.get('/', ${camelCaseName}Controller.findAll);
router.get('/:id', ${camelCaseName}Controller.findOne);
router.put('/:id', ${camelCaseName}Controller.update);
router.delete('/:id', ${camelCaseName}Controller.delete);

module.exports = router;
`;

// Write the files
fs.writeFileSync(modelPath, modelTemplate);
fs.writeFileSync(controllerPath, controllerTemplate);
fs.writeFileSync(routePath, routeTemplate);

console.log(`Model, controller, and routes for ${modelName} created successfully.`);
