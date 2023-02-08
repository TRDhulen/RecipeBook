// window load
window.addEventListener('DOMContentLoaded', init)

/**
 * data object
 * recipeName (header String):
 * cuisine (select):
 * difficulty (select): [may be converted to star difficulty ranking?]
 * ingredients (String):
 * directions (String):
 * notes (String):
 */
function init() {
    console.info("init function called");
    // get recipes from storage as data object
    let data = initStorage();
    // add each recipe to document
    addRecipesToDocument(data);
    // add event listeners to form element
    addRecipeHandler();
}

/**
 * initializes data from localStorage, if present
 * @returns String representation of localstorage rCards
 */
function initStorage() {    
    console.info("initStorage function called");
    // empty dataset
    const data = [];

    // checks for options in localstorage
    if(localStorage.getItem('options') == null) {
        console.info('options not found in localstorage, initializing...')
        const options = {
            cuisine: [
                'American',
                'Mexican',
                'Other'
                // add more
            ],
            difficulty: [
                'Easy',
                'Medium',
                'Hard'
            ]
        }
        localStorage.setItem('options', JSON.stringify(options));
    }

    // writes to local/window storage if empty
    if(localStorage.getItem('rCards') == null) {
        console.info('rCards not found in localstorage, initializing...')
        localStorage.setItem('rCards', JSON.stringify(data));
    };


    return JSON.parse(localStorage.getItem('rCards'));
}

/**
 * uses data to populate page
 * @param {object} data list of RecipeCard objects
 */
function addRecipesToDocument(data) {
    console.debuf('addRecipesToDocument called with data var: ', JSON.stringify(data));
    data.forEach((element, index) => {
        const recipe = document.createElement('recipe-card');
        recipe.data = element;
        // TODO: split rContainer into cuisines
        const rContainer = document.getElementById('recipe-container'); 
        rContainer.appendChild(recipe);
        // recipe.shadowRoot for change in cuisine later
    })
}

/**
 * defines document.updateData: saves all recipe-card objects in localstorage
 */
document.updateData = function () {
    // grab all recipes
    const rContainer = document.getElementById('recipe-container');
    const rList = rContainer.getElementsByTagName('recipe-card');
    const rData = [];

    // store recipes in rData
    console.log("Uploading recipes to local storage...");
    for(let i = 0; i < rList.length; i++) {
        rData.push(rList[i].getData());
    }

    localStorage.setItem('rCards', JSON.stringify(rData));
}

/**
 * function that listen to addButton on form
 * @param {Object} rContainer - contains all recipeCard objects
 */
function addRecipeListener (rContainer) {
    document
        .getElementById('fixedAddButton')
        .addEventListener('click', function() {
            console.info("Add button clicked.");
            const recipe = document.createElement('recipe-card');

            recipe.data = {
                recipeName: '',
                cuisine: '',
                difficulty: '',
                ingredients: '',
                directions: '',
                notes: ''
            }
            // auto expand new recipe
            recipe.shadowRoot.getElementById('expandButton').click();
            // activate edit new recipe
            recipe.shadowRoot.getElementById('editButton').click();
            rContainer.insertBefore(recipe, document.getElementById('insertPoint'));
        })
}

/**
 * TODO: split rContainer into cuisine lists
 * document.addToCuisine = function(recipe) {
 * const rContainer
 * switch (rContainer)
 * cases for cuisines...
 * rContainer.appendChild(recipe)
 * }
 */

// May use promises in online storage in retrieving https or else?