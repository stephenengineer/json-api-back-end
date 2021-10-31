# Tchaou Recipes API

Tchaou Recipes API is a simple JSON application programming interface that provides routes for getting and manipulating data for food recipes. This current implementation stores the 'backend information' in a file on the 'server' computer. However, it can easily be altered to store that info on a database instead.

## Technology

### Built with:

- Node.js
- Express
- JavaScript
- Testing on Mocha framework using Chai

## Installation Instructions

1. Run `npm install` to install project dependencies.
1. Run `npm run start` to start your server.

## API Documentation

In following with REST best practices, get requests return JSON responses. Post and put requests require an application/json body and return a JSON reponse.

### Endpoints

**Get Recipe List:** `GET /recipes`

- Requests names of all recipes
- Successful get request will return a status code of 200 and an object with a single property of `recipeNames` that contains an array of the names of the saved recipes

**Get Recipe By Name:** `GET /recipes/details/recipeName`

- `recipeName` must be replaced with the desired recipe's name
- Successful get request will return a status code of 200 and an object with a single property of `details` that contains a JSON object representing the saved reservation containing the following fields:
  - `ingredients`: array of the ingredients
  - `numSteps`: integer of the number of steps in the recipe

**Post Recipe:** `POST /recipes`

- Posts a single JSON object
- Post body must contain a JSON object representing the desired recipe to be created, containing the following fields:
  - `name`
  - `ingredients`
  - `instructions`
- Successful post request will return a status code of 201
- If the recipe already exists, the request will return a status code of 400 and a body containing the message `"error": "Recipe already exists"`

**Update Recipe:** `PUT /recipes`

- Puts a single JSON object
  - Put body must contain a JSON object representing the desired updated recipe to be saved
  - See above "Post Recipe" section for data type requirements
- Successful put request will return a status code of 204
- If the recipe doesn't exist, the request will return a status code of 404 and a body containing the message `"error": "Recipe does not exist"`

## About Me

- [Personal Portfolio](https://stephenengineer.github.io/portfolio/)
- [GitHub Profile](https://github.com/stephenengineer)
- [Twitter](https://twitter.com/StephenTchaou)
