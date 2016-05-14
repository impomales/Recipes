'use strict';

var id = 4;

var RECIPE_TEMPLATE = {
  key: -1,
  name: "",
  ingredients: []
};

var data = {
  recipes: [{
    key: 1,
    name: 'Pumpkin Pie',
    ingredients: ['Pumpkin Puree', 'Sweetened Condensed Milk', 'Eggs', 'Pumpkin Pie Spice', 'Pie   Crust']
  }, {
    key: 2,
    name: 'Spaghetti',
    ingredients: ['Noodles', 'Tomato Sauce', '(Optional) Meatballs']
  }, {
    key: 3,
    name: 'Onion Pie',
    ingredients: ['Onion', 'Pie Crust', 'Sounds Yummy right?']
  }],
  newRecipe: Object.assign({}, RECIPE_TEMPLATE)
};

var RecipeBox = React.createClass({
  displayName: 'RecipeBox',

  getInitialState: function getInitialState() {
    return JSON.parse(localStorage.getItem('_impomales_recipes')) || { data: data };
  },
  addRecipe: function addRecipe() {
    document.getElementById('addRecipe').style.display = "block";
  },
  editRecipe: function editRecipe(recipe) {
    this.state.data.newRecipe = Object.assign({}, recipe);
    this.setState(this.state.data.newRecipe, function () {
      console.log(this.state.data);
    });
    document.getElementById('EditRecipe-inputName').value = recipe.name;
    document.getElementById('EditRecipe-inputIngredients').value = recipe.ingredients.join(',');
    document.getElementById('editRecipe').style.display = "block";
  },
  deleteRecipe: function deleteRecipe(recipe) {
    this.state.data.newRecipe = Object.assign({}, recipe);
    this.setState(this.state.data.newRecipe, function () {
      console.log(this.state.data);
    });
    document.getElementById('deleteRecipe').style.display = "block";
  },
  handleCloseAdd: function handleCloseAdd() {
    document.getElementById('addRecipe').style.display = "none";
  },
  handleCloseEdit: function handleCloseEdit() {
    document.getElementById('editRecipe').style.display = "none";
  },
  handleCloseDelete: function handleCloseDelete() {
    document.getElementById('deleteRecipe').style.display = "none";
  },
  handleChange: function handleChange(changes) {
    this.setState(changes);
  },
  handleSubmitAdd: function handleSubmitAdd() {
    // add newRecipe to recipes arr.
    var recipe = Object.assign({}, this.state.data.newRecipe, { key: id });
    id++;
    var updatedRecipes = this.state.data.recipes.slice(0).concat(recipe);
    var update = Object.assign({}, { data: {
        newRecipe: Object.assign({}, RECIPE_TEMPLATE),
        recipes: updatedRecipes } });
    this.replaceState(update, function () {
      localStorage.setItem('_impomales_recipes', JSON.stringify(this.state));
      console.log(this.state);
    });

    this.handleCloseAdd();
  },
  handleSubmitEdit: function handleSubmitEdit() {
    var recipe = Object.assign({}, this.state.data.newRecipe);
    var recipes = this.state.data.recipes;
    var updatedRecipes = this.state.data.recipes.slice(0);
    var index = 0;
    for (index = 0; index < recipes.length; index++) {
      if (recipes[index].key === recipe.key) {
        updatedRecipes[index].name = recipe.name;
        updatedRecipes[index].ingredients = recipe.ingredients;
        break;
      }
    }

    var update = Object.assign({}, { data: {
        newRecipe: Object.assign({}, RECIPE_TEMPLATE),
        recipes: updatedRecipes } });
    this.replaceState(update, function () {
      localStorage.setItem('_impomales_recipes', JSON.stringify(this.state));
      console.log(this.state);
    });
    this.handleCloseEdit();
  },
  handleDelete: function handleDelete() {
    var recipe = Object.assign({}, this.state.data.newRecipe);
    var recipes = this.state.data.recipes;
    var updatedRecipes = this.state.data.recipes.slice(0);
    var index = 0;
    for (index = 0; index < recipes.length; index++) {
      if (recipes[index].key === recipe.key) break;
    }
    updatedRecipes.splice(index, 1);
    var update = Object.assign({}, { data: {
        newRecipe: Object.assign({}, RECIPE_TEMPLATE),
        recipes: updatedRecipes } });
    this.replaceState(update, function () {
      localStorage.setItem('_impomales_recipes', JSON.stringify(this.state));
      console.log(this.state);
    });
    this.handleCloseDelete();
  },
  render: function render() {
    var recipes = [];
    var newRecipe = this.state.data.newRecipe;
    var editRecipe = this.editRecipe;
    var deleteRecipe = this.deleteRecipe;
    this.state.data.recipes.forEach(function (recipe) {
      recipes.push(React.createElement(Recipe, {
        recipe: recipe,
        editRecipe: editRecipe,
        deleteRecipe: deleteRecipe
      }));
    });
    return React.createElement(
      'div',
      { 'class': 'row' },
      React.createElement(AddRecipe, {
        handleClose: this.handleCloseAdd,
        handleChange: this.handleChange,
        handleSubmit: this.handleSubmitAdd,
        newRecipe: newRecipe
      }),
      React.createElement(DeleteRecipe, {
        handleClose: this.handleCloseDelete,
        handleDelete: this.handleDelete,
        newRecipe: newRecipe
      }),
      React.createElement(EditRecipe, {
        handleClose: this.handleCloseEdit,
        handleChange: this.handleChange,
        handleSubmit: this.handleSubmitEdit,
        newRecipe: newRecipe
      }),
      React.createElement(
        'div',
        { id: 'Title', 'class': 'col-xs-12' },
        React.createElement(
          'h1',
          null,
          'Recipes'
        )
      ),
      React.createElement(
        'div',
        { id: 'RecipeBox', className: 'col-md-12' },
        recipes,
        React.createElement(
          'button',
          { className: 'myButton', onClick: this.addRecipe },
          'Add Recipe'
        )
      )
    );
  }
});

var Recipe = React.createClass({
  displayName: 'Recipe',

  onClick: function onClick() {
    var arr = document.getElementsByClassName('Ingredients-ingredients');

    document.getElementById(this.props.recipe.key).classList.toggle('show');
  },
  render: function render() {

    return React.createElement(
      'div',
      { id: 'Recipe-recipe' },
      React.createElement(
        'button',
        { id: 'Recipe-name',
          className: 'accordion',
          onClick: this.onClick },
        this.props.recipe.name
      ),
      React.createElement(Ingredients, {
        recipe: this.props.recipe,
        editRecipe: this.props.editRecipe,
        deleteRecipe: this.props.deleteRecipe,
        handleClose: this.props.handleClose
      })
    );
  }
});

var Ingredients = React.createClass({
  displayName: 'Ingredients',

  editRecipe: function editRecipe() {
    this.props.editRecipe(this.props.recipe);
  },
  deleteRecipe: function deleteRecipe() {
    this.props.deleteRecipe(this.props.recipe);
  },
  render: function render() {
    var ingredients = [];
    this.props.recipe.ingredients.forEach(function (ingredient) {
      ingredients.push(React.createElement(
        'li',
        null,
        ingredient
      ));
    });
    return React.createElement(
      'div',
      { id: this.props.recipe.key, className: 'Ingredients-ingredients' },
      React.createElement(
        'h4',
        { id: 'Ingredient-ingredient' },
        React.createElement(
          'em',
          null,
          'Ingredients'
        )
      ),
      React.createElement(
        'ul',
        null,
        ingredients
      ),
      React.createElement(
        'span',
        null,
        React.createElement(
          'button',
          { className: 'myButton', onClick: this.deleteRecipe },
          'Delete'
        ),
        React.createElement(
          'button',
          { className: 'myButton', onClick: this.editRecipe },
          'Edit'
        )
      )
    );
  }
});

var AddRecipe = React.createClass({
  displayName: 'AddRecipe',

  handleClose: function handleClose() {
    this.props.handleClose();
  },
  handleNameChange: function handleNameChange(event) {
    Object.assign(this.props.newRecipe, { name: event.target.value });
    this.props.handleChange(this.props.newRecipe);
  },
  handleIngredientChange: function handleIngredientChange(event) {
    var arr = event.target.value.split(',');
    Object.assign(this.props.newRecipe, { ingredients: arr });
    this.props.handleChange(this.props.newRecipe);
  },
  handleSubmit: function handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit();
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'addRecipe', className: 'modal' },
      React.createElement(
        'div',
        { className: 'modal-content' },
        React.createElement(
          'span',
          null,
          React.createElement(
            'h4',
            null,
            'Add a Recipe'
          ),
          React.createElement(
            'button',
            { className: 'close', onClick: this.handleClose },
            'x'
          )
        ),
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'h5',
            null,
            React.createElement(
              'b',
              null,
              'Recipe Name'
            )
          ),
          React.createElement('input', {
            type: 'text',
            name: 'recipeName',
            placeholder: 'Recipe Name',
            onChange: this.handleNameChange,
            className: 'AddRecipe-inputName',
            required: true
          }),
          React.createElement(
            'h5',
            null,
            React.createElement(
              'b',
              null,
              'Ingredients'
            )
          ),
          React.createElement('input', {
            type: 'text',
            name: 'ingredients',
            placeholder: 'Enter Ingredients,Separated,By Commas',
            onChange: this.handleIngredientChange,
            className: 'AddRecipe-inputIngredients',
            required: true
          }),
          React.createElement(
            'span',
            null,
            React.createElement(
              'button',
              { className: 'myButton', type: 'submit' },
              'Add Recipe'
            )
          )
        )
      )
    );
  }
});

var DeleteRecipe = React.createClass({
  displayName: 'DeleteRecipe',

  handleClose: function handleClose() {
    this.props.handleClose();
  },
  handleDelete: function handleDelete() {
    this.props.handleDelete();
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'deleteRecipe', className: 'modal' },
      React.createElement(
        'div',
        { className: 'modal-content' },
        React.createElement(
          'span',
          null,
          React.createElement(
            'h4',
            null,
            'Delete Recipe'
          ),
          React.createElement(
            'button',
            {
              className: 'close',
              onClick: this.handleClose
            },
            'x'
          )
        ),
        React.createElement(
          'p',
          null,
          'Are you sure?'
        ),
        React.createElement(
          'span',
          null,
          React.createElement(
            'button',
            { id: 'Yes', className: 'myButton', onClick: this.handleDelete },
            'Yes'
          ),
          React.createElement(
            'button',
            { id: 'No', className: 'myButton', onClick: this.handleClose },
            'No'
          )
        )
      )
    );
  }
});

var EditRecipe = React.createClass({
  displayName: 'EditRecipe',

  handleClose: function handleClose() {
    this.props.handleClose();
  },
  handleSubmit: function handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit();
  },
  handleNameChange: function handleNameChange(event) {
    Object.assign(this.props.newRecipe, { name: event.target.value });
    this.props.handleChange(this.props.newRecipe);
  },
  handleIngredientChange: function handleIngredientChange(event) {
    var arr = event.target.value.split(',');
    Object.assign(this.props.newRecipe, { ingredients: arr });
    this.props.handleChange(this.props.newRecipe);
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'editRecipe', className: 'modal' },
      React.createElement(
        'div',
        { className: 'modal-content' },
        React.createElement(
          'span',
          null,
          React.createElement(
            'h4',
            null,
            'Edit Recipe'
          ),
          React.createElement(
            'button',
            {
              className: 'close',
              onClick: this.handleClose
            },
            'x'
          )
        ),
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'h5',
            null,
            React.createElement(
              'b',
              null,
              'Recipe Name'
            )
          ),
          React.createElement('input', {
            type: 'text',
            name: 'recipeName',
            placeholder: 'Recipe Name',
            onChange: this.handleNameChange,
            id: 'EditRecipe-inputName',
            required: true
          }),
          React.createElement(
            'h5',
            null,
            React.createElement(
              'b',
              null,
              'Ingredients'
            )
          ),
          React.createElement('input', {
            type: 'text',
            name: 'ingredients',
            placeholder: 'Enter Ingredients,Separated,By Commas',
            onChange: this.handleIngredientChange,
            id: 'EditRecipe-inputIngredients',
            required: true
          }),
          React.createElement(
            'span',
            null,
            React.createElement(
              'button',
              { className: 'myButton', type: 'submit' },
              'Edit Recipe'
            )
          )
        )
      )
    );
  }
});

React.render(React.createElement(RecipeBox, null), document.getElementById('recipeBox'));