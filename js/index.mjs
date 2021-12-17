import Recipe from "./model/recipe.mjs";
import recipesData from "./recipes.mjs";
import tag from "./model/tag.mjs";
import DomFilter from "./model/domFilter.mjs";


async function fetchData(recipesData) {
    let recipesTab = []
    recipesData.array.forEach(recipeData => {
        recipesTab.push(new Recipe(recipeData))
    });
    return recipesTab
}
function renderRecipes(tab) {
    const recipesDom = document.querySelector(".recipes")
    recipesDom.innerHTML="";
    const norecipes= document.querySelector('[data-norecipes]');
    if (tab.length == 0) {
        norecipes.style.display = '';
    }
    tab.forEach(element => {
        let recipeEle = new Recipe(element)
        const dom = recipeEle.render()
        recipesDom.appendChild(dom)
    })
}
 
function filterSearch(recipes) {
    // Search into name, description, appliance, ingredients name, ustensils
    //const t0 = performance.now(), q = recipes.length;
    const term = search.value.toLowerCase();
    console.log(term)
    recipes = recipes.filter((recipe) => {
        if (recipe.name.includes(term)) {
            return true;
        }
        if (recipe.description.toLowerCase().includes(term)) {
            return true;
        }
        if (recipe.appliance.includes(term)) {
            return true;
        }
        if (!!recipe.ingredients.find((ingredient) =>ingredient.ingredient.includes(term))) {
            return true;
        }
        if (!!recipe.ustensils.find((ustensil) => ustensil.includes(term))) {
            return true;
        }
        return false;
    });
    //const t1 = performance.now(); console.log(`Search time ${t1 - t0} ms | ${(t1 - t0) / q} per recipe`);
    return recipes;
}
function applyFilterRecipes (recipes, filter) {
    let filtered = [];
    if (search.value.length < 3) filtered = recipes;
    else filtered = filterSearch(recipes);// Search filter
    this.checkStateTags(filtered);// Clear invalid active tags
    filtered = filterTags(filtered);// Tags filter
    updateAvailableTags(filtered);
    if (filter) renderFilter();// Rerender on active
    return filtered;
}
function activeIn (filter) {
    activeOut(filter);// Close active filter
    console.log(filter)
    filter.container.classList.add('active');
    filter.label.style.display = 'none';
    filter.input.style.display = '';
    filter.input.focus();
    renderFilter(filter);
}
function activeOut (filter, e) {
    filter.container.classList.remove('active');
    filter.container.classList.remove('expanded');
    filter.label.style.display = '';
    filter.input.style.display = 'none';
    filter.input.value = "";
    filter.results.style.display = 'none';
}
function toggle (filter) {
    if (!filter) activeIn(filter);// Not active do it
    // Toggle visual expanded state
    filter.container.classList.toggle('expanded');
    // Focus input on open
    if (filter.container.classList.contains('expanded')) filter.input.focus();
}
function  renderFilter (filter) {
    const filteredRecipes = []; 
    const filterTypes = ['ingredients', 'appliances', 'ustensils'];
    //const filter = this.stateFilter; // Shortcut
    filter.results.style.display = 'none';
    filter.results.innerHTML = '';// Clean container
    this.tags[filter.name].forEach((item) => {
        const tag = new Tag(item, filter.name)
        if (this.tagIsActive(tag)) return;// Escape active tags
        if (filter.input.value.length > 0 && !tag.name.includes(filter.input.value.toLowerCase())) return;// Escape search result
        const elTag = tag.renderLi();
        elTag.addEventListener('click', (e) => {// Add tag on click
            e.stopPropagation();
            this.addTag(tag);
        });
        filter.results.append(elTag);
    });
    if (filter.results.children.length > 0) 
        filter.results.style.display = '';
}








async function init() {
    renderRecipes(recipesData);
    const search= document.querySelector('[data-search]');
    search.addEventListener("keyup", ()=>{
      
        const tab = applyFilterRecipes(recipesData)
        console.log(tab)     
        renderRecipes(tab)
    })
    let  filters= {
        ingredients: new DomFilter(document.querySelector('[data-filter="ingredients"]')),
        appliances: new DomFilter(document.querySelector('[data-filter="appliances"]')),
        ustensils: new DomFilter(document.querySelector('[data-filter="ustensils"]'))
    }
    for (const [, filter] of Object.entries(filters)) {
        console.log(filter)
        filter.label.addEventListener('click', (e) => {// Active state
            console.log("hello")
            activeIn(filter);
        });
        filter.expand.addEventListener('click', (e) => {// Expand state
            toggle(filter);
        });
        filter.input.addEventListener('keyup', renderFilter.bind(this));// Filter input change
    }
    //this.dom.search.addEventListener('keyup', this.renderRecipes.bind(this));// Search input change
}
    /*
    const tags =  document.querySelector('[data-filter-tags]')
    let stateTags = [];
    tags.innerHTML = '';
    stateTags.forEach((tag) => {
        const elTag = tag.renderTag();
        //elTag.querySelector('button').addEventListener('click', (e) => this.removeTag(tag));// Remove tag on click
        tags.append(elTag);
    });
    console.log(stateTags)*/
    


init();