const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./app");
const expect = chai.expect;
chai.use(chaiHttp);
const fs = require("fs");

const fileName = "./data.json";

describe("Test", function () {
  it("should pass if Mocha and Chai are set up properly", function (done) {
    chai
      .request(app)
      .delete("/")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Not Found", function () {
  it("should return a message that something went wrong with status code 404 if a nonexistent route is requested", function (done) {
    chai
      .request(app)
      .get("/nonexistent")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.eql({
          error: `The route /nonexistent does not exist!`,
        });
        done();
      });
  });
});

describe("GET /recipes", function () {
  it("should return all recipe names", function (done) {
    chai
      .request(app)
      .get("/recipes")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.eql({
          recipeNames: ["scrambledEggs", "garlicPasta", "chai"],
        });
        done();
      });
  });
});

describe("GET /recipes/details/:recipeName", function () {
  it("should return the ingredients and the number of steps in the recipe as JSON", function (done) {
    chai
      .request(app)
      .get("/recipes/details/garlicPasta")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data).to.eql({
          details: {
            ingredients: [
              "500mL water",
              "100g spaghetti",
              "25mL olive oil",
              "4 cloves garlic",
              "Salt",
            ],
            numSteps: 5,
          },
        });
        done();
      });
  });

  it("should return an empty object if the recipe does NOT exist", function (done) {
    chai
      .request(app)
      .get("/recipes/details/nonexistent")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.eql({});
        done();
      });
  });
});

describe("POST /recipes", function () {
  it("should add additional recipes in the existing format to the backend", function (done) {
    chai
      .request(app)
      .post("/recipes")
      .send({
        data: {
          name: "butteredBagel",
          ingredients: ["1 bagel", "butter"],
          instructions: ["cut the bagel", "spread butter on bagel"],
        },
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.eql({});
        expect(require("./data.json").recipes).to.deep.include({
          name: "butteredBagel",
          ingredients: ["1 bagel", "butter"],
          instructions: ["cut the bagel", "spread butter on bagel"],
        });
        done();
      });
  });

  it("should return a message that the recipe already exists with status code 400 if the recipe already exists", function (done) {
    chai
      .request(app)
      .post("/recipes")
      .send({
        data: {
          name: "butteredBagel",
          ingredients: ["1 bagel", "butter"],
          instructions: ["cut the bagel", "spread butter on bagel"],
        },
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.eql({
          error: "Recipe already exists",
        });
        done();
      });
  });

  it("should return a message that the body is missing data with status code 400 if the post request is missing properties", function (done) {
    chai
      .request(app)
      .post("/recipes")
      .send({
        data: {},
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.eql({
          error:
            "Recipe must have a name. Recipe must have ingredients. Recipe must have instructions.",
        });
        done();
      });
  });
});

describe("PUT /recipes", function () {
  it("should properly update an existing recipe", function (done) {
    chai
      .request(app)
      .put("/recipes")
      .send({
        data: {
          name: "butteredBagel",
          ingredients: ["1 bagel", "2 tbsp butter"],
          instructions: ["cut the bagel", "spread butter on bagel"],
        },
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        expect(res.body).to.eql({});
        expect(require("./data.json").recipes).to.deep.include({
          name: "butteredBagel",
          ingredients: ["1 bagel", "2 tbsp butter"],
          instructions: ["cut the bagel", "spread butter on bagel"],
        });
        done();
      });
  });

  it("should return a message that the recipe does not exist with status code 404 if the recipe does NOT exist", function (done) {
    chai
      .request(app)
      .put("/recipes")
      .send({
        data: {
          name: "Nonexistent",
          ingredients: ["1 bagel", "butter"],
          instructions: ["cut the bagel", "spread butter on bagel"],
        },
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.eql({
          error: "Recipe does not exist",
        });
        const file = require(fileName);
        const recipes = require(fileName).recipes;
        if (recipes.some((recipe) => recipe.name === "butteredBagel")) {
          recipes.pop();
          fs.writeFile(
            fileName,
            JSON.stringify(file, null, 2),
            function writeJSON(err) {
              if (err) throw err;
              console.log(JSON.stringify(file, null, 2));
              console.log("writing to " + fileName);
            }
          );
        }
        done();
      });
  });

  it("should return a message that the body is missing data with status code 400 if the put request is missing properties", function (done) {
    chai
      .request(app)
      .put("/recipes")
      .send({
        data: {},
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.eql({
          error:
            "Recipe must have a name. Recipe must have ingredients. Recipe must have instructions.",
        });
        done();
      });
  });
});
