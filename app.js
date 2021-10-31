const express = require("express");
const morgan = require("morgan");
const fs = require("fs");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const fileName = "./data.json";
const file = require(fileName);
const recipes = require(fileName).recipes;

const appendToData = (recipes) => {
  return fs.writeFile(
    fileName,
    JSON.stringify(file, null, 2),
    function writeJSON(err) {
      if (err) return console.error(err);
      console.log(JSON.stringify(file, null, 2));
      console.log("writing to " + fileName);
    }
  );
};

function recipeBodyValidation(req, res, next) {
  const { name, ingredients, instructions } = req.body.data;
  let message = "";
  if (!name || !name.length) {
    message += "Recipe must have a name.";
  }
  if (!ingredients || !ingredients.length) {
    message += `${message ? " " : ""}Recipe must have ingredients.`;
  }
  if (!instructions || !instructions.length) {
    message += `${message ? " " : ""}Recipe must have instructions.`;
  }
  if (message) {
    return next({
      status: 400,
      message,
    });
  }
  res.locals.recipe = req.body.data;
  return next();
}

function listRecipes(req, res, next) {
  if (recipes && recipes.length) {
    const data = { recipeNames: [] };
    data.recipeNames = recipes.map((recipe) => recipe.name);
    return res.json({ data });
  }
  return res.json({ data: "There are no listed recipes!" });
}

function getRecipeDetails(req, res, next) {
  const { recipeName } = req.params;
  if (recipes && recipes.length) {
    const data = { details: { ingredients: [], numSteps: 0 } };
    const foundRecipe = recipes.find((recipe) => recipe.name === recipeName);
    if (foundRecipe) {
      data.details.ingredients = foundRecipe.ingredients;
      data.details.numSteps = foundRecipe.instructions.length;
      return res.json({ data });
    }
  }
  return res.json({});
}

function createRecipe(req, res, next) {
  const newRecipe = res.locals.recipe;

  const possibleDuplicateRecipe = recipes.find(
    (recipe) => recipe.name === newRecipe.name
  );
  if (possibleDuplicateRecipe)
    return next({ status: 400, message: "Recipe already exists" });

  recipes.push(newRecipe);
  try {
    appendToData(recipes);
    return res.sendStatus(201);
  } catch (error) {
    const { status = 500, message = error } = error;
    return next({ status, message });
  }
}

function editRecipe(req, res, next) {
  const { name } = res.locals.recipe;
  if (recipes && recipes.length) {
    let foundRecipe = recipes.find((recipe) => recipe.name === name);
    if (foundRecipe) {
      for (const key in res.locals.recipe) {
        foundRecipe[key] = res.locals.recipe[key];
      }
      try {
        appendToData(recipes);
        return res.sendStatus(204);
      } catch (error) {
        const { status = 500, message = error } = error;
        return next({ status, message });
      }
    }
  }
  return next({ status: 404, message: "Recipe does not exist" });
}

app.get("/recipes", listRecipes);

app.get("/recipes/details/:recipeName", getRecipeDetails);

app.post("/recipes", recipeBodyValidation, createRecipe);

app.put("/recipes", recipeBodyValidation, editRecipe);

/** Testing purposes */
app.delete("/", (req, res, next) => {
  return res.sendStatus(200);
});

// Not Found Handler
app.use((req, res, next) => {
  return next({
    status: 404,
    message: `The route ${req.path} does not exist!`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  console.error(message);
  return res.status(status).json({ error: message });
});

module.exports = app;
