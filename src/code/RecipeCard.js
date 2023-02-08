// import functions
const func = require('./exports.js');

/**
 * @class RecipeCard
 */
class RecipeCard extends HTMLElement {
    constructor() {
        super();
        // add data var to element, 'underscore' to mark private
        this._data = {};

        // import css style link
        var link = document.createElement('link');
        // set link attributes
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = './src/style/recipe-style.css';

        // create shadow DOM, open means shadowRoot is accessible
        const shadow = this.attachShadow({ mode: 'open' });
        // main container always visible
        const mainContainer = document.createElement('div');
        mainContainer.setAttribute('class', 'main-container');
        // header contains recipe name
        const header = document.createElement('span');
        header.setAttribute('class', 'recipe-header');
        // content is collapsible
        const content = document.createElement('div');
        content.setAttribute('class', 'recipe-content');
        // attach to shadow DOM
        shadow.appendChild(mainContainer);
        mainContainer.appendChild(header);
        mainContainer.appendChild(content);
        shadow.appendChild(link);
    }

    // get func() called by obj.func
    get data() {
        return this._data;
    }

    // set func(param) called by obj.func = param
    set data(data) {
        // checks for falsy (empty) data
        if(!data) return;

        this._data = data;

        const options = JSON.parse(localStorage.getItem('options'));
        if(!options) { console.error('Options not found in local storage.')}
        const cuisine = options?.cuisine;
        const difficulty = options?.difficulty;

        header.innerHTML =
        // contains the recipe name, cuisine, difficulty, expand and delete buttons
        `
            <span class="recipe-show name-show" style="width:210px">` +
                func.capFirstEach(data.recipeName) + 
            `</span>
            <input type="text" class="recipe-edit name-input" style="display:none">` +
                func.capFirstEach(data.recipeName) + 
            `</text>
            <span class="recipe-show cuisine-input" style="width:210px">` +
                func.capFirst(data.cuisine) + 
            `</span>
            <select style="display: none" class="recipe-edit cuisine-input" value="` +
            data.cuisine +
            `">
                ${cuisine.map((option) =>
                `<option value="${option}">${func.capFirstEach(option)})}</option>`)
                .join('')}
            </select>
            <span class="recipe-show difficulty-input" style="width:210px">` +
                func.capFirst(data.difficulty) + 
            `</span>
            <select style="display: none" class="recipe-edit difficulty-input" value="` +
            data.difficulty +
            `">
                ${difficulty.map((option) =>
                `<option value="${option}">${func.capFirstEach(option)})}</option>`)
                .join('')}
            </select>
            <span id="expandButton" class="material-icons expand-button recipe-show">expand_more</span>
            <span class='material-icons delete-button' style='display:none;color:red'>delete</span>
        `

        content.innerHTML =
        // contains the ingredients, directions, notes, edit, save and cancel buttons
        `
        <div>
            <div>
                <p class="recipe-show ingredients-show ingredients">` +
                    data.ingredients +
                `</p>
                <textarea class="recipe-edit ingredients-input ingredients">` +
                    data.ingredients +
                `</textarea>
            </div>
            <div>
                <p class="recipe-show directions-show directions">` +
                    data.directions +
                `</p>
                <textarea class="recipe-edit directions-input directions">` +
                    data.directions +
                `</textarea>
            </div>
            <div>
                <p class="recipe-show notes-show notes">` +
                    data.notes +
                `</p>
                <textarea class="recipe-edit notes-input notes">` +
                    data.notes +
                `</textarea>
            </div>
            <div style='position:absolute;bottom:0;right:20px'>
                <span id='editButton' class='recipe-show material-icons edit-button' style='color:#ffba52'>edit</span>
                <img src='src/assets/saveIcon.png' class='recipe-edit material-icons submit-button' style='display:none;color:green;width:24px'>
                <img src='src/assets/undoIcon.png' class='recipe-edit material-icons cancel-button' style='display:none;color:red;width:24px'>
            </div>
        </div>
        `

        this.header = header;
        // this.content = content
        this.addEventListener(header, content);
    }

    /**
     * listener for buttons on RecipeCard
     * @param {HTMLElement} header contains recipe name
     * @param {HTMLElement} content contains recipe content
     * @param {object} data contains recipe data
     * @param {object} options contains recipe options
     */
    allListener(header, content) {
        // editButton listener
        const editButton = header.querySelector('.edit-button');
        editButton.addEventListener('click', function() {
            console.info("Edit button pressed.");
            showHide(header, content, true);
        })

        // expandButton listener
        const expandButton = header.querySelector('.expand-button');
        expandButton.addEventListener('click', function() {
            // alternate between show and hide
            console.info("Expand button pressed.");
            let display = content.style.display === 'flex';
            content.style.display = (display ? 'none' : 'flex');
            expandButton.textContent = (display ? 'expand_more' : 'expand_less');
        })

        // deleteButton listener
        const deleteButton = header.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            console.info("Delete button pressed.");
            // store path to main.js document.updateData()
            const updateFunc = this.getRootNote().host.getRootNode().updateData;
            // remove the card from the document
            this.getRootNode().host.remove()
            // delete (update) local storage
            updateFunc();
        })

        // submitButton listener
        const submitButton = content.querySelector('.submit-button');
        submitButton.addEventListener('click', function() {
            // change *-show data to correlate with *-input data
            console.info("Submit button pressed.");
            exchangeData(header, content, true);
            showHide(header, content, false);
            // callback to main.js document.updateData()
            this.getRootNode().host.getRootNode().updateData();
        })

        // cancelButton listener
        const cancelButton = content.querySelector('.cancel-button');
        cancelButton.addEventListener('click', function() {
            // change *-input data to correlate with *-show data
            console.info("Cancel button pressed.");
            exchangeData(header, content, false);
            showHide(header, content, false);
        })

        /**
         * swap the showing and hidden parts of the recipe-card (editing)
         * @param {HTMLElement} header contains recipe name
         * @param {HTMLElement} content contains recipe content
         * @param {boolean} edit is edit call or not
         */
        function showHide(header, content, edit) {
            console.debug("showHide function called with edit var: ", edit);
            const toShow = (edit ? content.getElementsByClassName('recipe-edit') : content.getElementsByClassName('recipe-show'));
            const toShow2 = (edit ? header.getElementsByClassName('recipe-edit') : header.getElementsByClassName('recipe-show'));
            const toHide = (edit ? content.getElementsByClassName('recipe-show') : content.getElementsByClassName('recipe-edit'));
            const toHide2 = (edit ? header.getElementsByClassName('recipe-show') : header.getElementsByClassName('recipe-edit'));
            for (let i = 0; i < toShow.length; i++) {
                toShow[i].style.display = 'inline-block';
            }
            for (let x = 0; x < toShow2.length; x++) {
                toShow2[x].style.display = 'inline-block';
            }
            for (let y = 0; y < toHide.length; y++) {
                toHide[y].style.display = 'none';
            }
            for (let y = 0; y < toHide2.length; y++) {
                toHide2[y].style.display = 'none';
            }
        }

        /**
         * sets the value between input and show fields, if submit is true: show = input, else (cancel) input = show
         * @param {HTMLElement} header contains recipe name
         * @param {HTMLElement} content contains recipe content
         * @param {boolean} submit is submit call or not
         */
        function exchangeData(header, content, submit) {
            console.debug("exchangeData function called with submit var: ", submit);
            const rNameS = header.getElementsByClassName('name-show')[0];
            const rNameI = header.getElementsByClassName('name-input')[0];
            const cuisineS = header.getElementsByClassName('cuisine-show')[0];
            const cuisineI = header.getElementsByClassName('cuisine-input')[0];
            const diffS = header.getElementsByClassName('difficulty-show')[0];
            const diffI = header.getElementsByClassName('difficulty-input')[0];
            // Future improvement if ingredients/directions are in list form.
            const ingredientsS = content.getElementsByClassName('ingredients-show')[0];
            const ingredientsI = content.getElementsByClassName('ingredients-input')[0];
            const directS = content.getElementsByClassName('directions-show')[0];
            const directI = content.getElementsByClassName('directions-input')[0];
            const notesS = content.getElementsByClassName('notes-show')[0];
            const notesI = content.getElementsByClassName('notes-input')[0];
            if(submit) {
                rNameS.innerHTML = rNameI.value;
                cuisineS.innerHTML = cuisineI.value;
                diffS.innerHTML = diffI.value;
                ingredientsS.innerHTML = ingredientsI.value;
                directS.innerHTML = directI.value;
                notesS.innerHTML = notesS.value;
            } else {
                rNameI.value = rNameS.innerHTML;
                cuisineI.value = cuisineS.innerHTML;
                diffI.value = diffS.innerHTML;
                ingredientsI.value = ingredientsS.innerHTML;
                directI.value = directS.innerHTML;
                notesI.value = notesS.innerHTML;
            }
        }
    }

    /**
     * creates a data object from RecipeCard
     * @returns data object containing RecipeCard info
     */
    getData() {
        const header = this.header;
        const content = this.content
        console.debug('getData function called for: ', header.getElementsByClassName('name-input')[0].value);
        return data =  {
            recipeName: header.getElementsByClassName('name-input')[0].value,
            cuisine: header.getElementsByClassName('cuisine-input')[0].getAttribute('value'),
            difficulty: header.getElementsByClassName('difficulty-input')[0].getAttribute('value'),
            ingredients: content.getElementsByClassName('ingredients-input')[0].value,
            directions: content.getElementsByClassName('directions-input')[0].value,
            notes: content.getElementsByClassName('notes-input')[0].value
        }
    }
}

// define HTML keyword
customElements.define('recipe-card', RecipeCard);

/**
 * May be transformed into a prototype
 * dynamic functions/attributes - customElem.prototype.(name)
 * static functions - customElem.(name)
 */