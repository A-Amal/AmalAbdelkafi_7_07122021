import Recipe from "./model/recipe.mjs";
import recipesData from "./recipes.mjs";
import Tag from "./model/tag.mjs";
import DomFilter from "./model/domFilter.mjs";


async function fetchData(recipesData) {
    let recipesTab = []
    recipesData.array.forEach(recipeData => {
        recipesTab.push(new Recipe(recipeData))
    });
    return recipesTab
}
function  renderTags (tag, stateTags) {
    
    const tagsClasses = {
        ingredients: 'primary',
        appliances: 'success',
        ustensils: 'danger',
    }
    const domTags=document.querySelector('[data-filter-tags]')
    domTags.innerHTML = '';
    console.log(typeof(tag))
    //tag = new Tag(tag , stateTags.type)
    const elTag = tag.renderTag(tagsClasses[tag.type]);
    elTag.querySelector('button').addEventListener('click', (e) => removeTag(tag));// Remove tag on click
    domTags.append(elTag);
    elTag.classList.add(tagsClasses[tag.type])
    stateTags.push(tag.name)
    
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
    // Search into name, description, appliances, ingredients name, ustensils
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
        if (recipe.appliances.includes(term)) {
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
function  filterTags(recipes, stateTags) {
    stateTags.forEach((tag) => {
        recipes = recipes.filter((recipe) => recipe.tagAvailable(tag));
    });
    return recipes;
}

function applyFilterRecipes (recipes, tags, stateTags) {
    console.log(tags)
    let filtered = [];
    if (search.value.length < 3) filtered = recipes;
    else filtered = filterSearch(recipes);// Search filter
    checkStateTags (filtered, tags, stateTags)
    // Clear invalid active tags
    console.log(stateTags)
    //filtered = filterTags(filtered, stateTags);// Tags filter
    console.log(tags)
    //updateAvailableTags(filtered, tags);
    //if (filter) renderFilter();// Rerender on active
    return filtered;
}
function activeIn (filtred, filter, tags, stateTags) {
    const filterActive =filter;
    console.log(filterActive)
    const filtersDom = document.getElementsByClassName("combobox")
    console.log(filtersDom)
    //for(const filterDom in filtersDom)
     //  activeOut(filterDom)
    console.log("active")
    filterActive.container.classList.add('active');
    filterActive.label.style.display = 'none';
    filterActive.input.style.display = '';
    filterActive.input.focus();
    
    console.log(filter)
    renderFilter(filtred, filterActive, tags, stateTags);
}
function activeOut (filter) {
    console.log(filter)
    console.log(filter +"not active")
    console.log(filter.ge)
    filter.classList.remove('active');
    filter.container.classList.remove('expanded');
    filter.label.style.display = '';
    filter.input.style.display = 'none';
    filter.input.value = "";
    filter.results.style.display = 'none';
}
function toggle (filter, tags) {
    if (!filter) activeIn(filtred, filter, tags, stateTags);
    // Toggle visual expanded state
    filter.container.classList.toggle('expanded');
    // Focus input on open
    if (filter.container.classList.contains('expanded')) filter.input.focus();
}
function clickOutside (e,filter, stateFilter) {
    let clickTarget = e.target;
    do {
        if (clickTarget == stateFilter.container) return;
        clickTarget = clickTarget.parentNode;
    } while (clickTarget);
    activeOut(filter, e);
}
function renderFilter(filtred, filter, tags, stateTags) {
    tags.ingredients = [];
    tags.ustensils = [];
    tags.appliances = [];
    console.log(filter)
    filter.results.style.display = 'none';
    filter.results.innerHTML = '';// Clean container
    filtred.forEach((item) => {
        let filterNames = filter.name;
        let name;
        item[filterNames].forEach(elemnt => {
            let filterName = filterNames.substring(0, filterNames.length - 1)
            if (filterName == "ingredient") { 
                if(!tags[filterNames].includes(elemnt[filterName])){
                    name =elemnt[filterName];
                    tags[filterNames].push(elemnt[filterName])
                    stateTags.push(elemnt[filterName]);
                    const tag = new Tag(name, filter.name);
                    const elTag = tag.renderLi();
                    if (filter.input.value.length > 0 && !tag.name.includes(filter.input.value.toLowerCase())) return;// Escape search result
                    elTag.addEventListener('click', (e) => {// Add tag on click
                        e.stopPropagation();
                        addTag(tag, stateTags, tags);
                    })
                    filter.results.append(elTag);
                    if (tagIsActive(tag, stateTags)) return;// Escape active tags
                }
            }
            else { 
                if(!tags[filterNames].includes(elemnt)){
                    tags[filterNames].push(elemnt)
                    stateTags.push(elemnt)
                    name = elemnt
                    const tag = new Tag(name, filter.name);
                    const elTag = tag.renderLi();
                    if (filter.input.value.length > 0 && !tag.name.includes(filter.input.value.toLowerCase())) return;// Escape search result
                    elTag.addEventListener('click', (e) => {// Add tag on click
                        e.stopPropagation();
                        addTag(tag, stateTags, tags);
                    })
                    filter.results.append(elTag);
                    if (tagIsActive(tag, stateTags)) return;// Escape active tags
                }
             }
            
            
        });
    });

    if (filter.results.children.length > 0)
        filter.results.style.display = '';
}
function tagIsActive (tag, stateTags) {
    const id = stateTags.findIndex((item) =>
                         item.name == tag.name && item.type == tag.type );
    if (id >= 0) return true;
    return false;
}
function checkStateTags (filtered, tags, stateTags) {
    updateAvailableTags(filtered, tags);
    const stateTagsLength = stateTags.length;
    stateTags.forEach((tag, key) => {
        if (!tags[tag.type].includes(tag.name)) stateTags.splice(key, 1);
    });
    if (stateTagsLength != stateTags.length) renderTags();// Rerender on change
}

function updateAvailableTags (recipes , tags) {
    // Reset tags
    tags.ingredients = [];
    tags.ustensils = [];
    tags.appliances = [];
    // Set new tags
    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            if (!tags.ingredients.includes(ingredient.ingredient)) 
                tags.ingredients.push(ingredient.ingredient);
        });
        recipe.ustensils.forEach((ustensil) => {
            if (!tags.ustensils.includes(ustensil)) tags.ustensils.push(ustensil);
        });
        if (!tags.appliances.includes(recipe.appliances)) tags.appliances.push(recipe.appliances);
    });
}
function addTag (tag, stateTags, tags) {
    const id = stateTags.findIndex((item) => item.name == tag.name);
    if (id < 0) {
        stateTags.push(tag);
        console.log(tag)
        renderTags(tag, stateTags);
        const tabFiltred = applyFilterRecipes (recipesData, tags, stateTags)
        console.log(tabFiltred)
        //renderRecipes(tabFiltred);
    }
}


async function init() {
    let stateTags = [];
    let tags = {
        ingredients: [],
        ustensils: [],
        appliances: []
    }
    let filtred = []
    renderRecipes(recipesData);
    filtred = recipesData;
    const search= document.querySelector('[data-search]');
    search.addEventListener("keyup", ()=>{
        const tab = applyFilterRecipes(recipesData, tags, stateTags)
        filtred = tab;    
        renderRecipes(tab)
    })
    
    let  filters= {
        ingredients: new DomFilter(document.querySelector('[data-filter="ingredients"]')),
        appliancess: new DomFilter(document.querySelector('[data-filter="appliances"]')),
        ustensils: new DomFilter(document.querySelector('[data-filter="ustensils"]'))
    }
    for (const [, filter] of Object.entries(filters)) {
        filter.label.addEventListener('click', (e) => {// Active state
            console.log("hello")
            console.log(filtred)
            activeIn(filtred, filter, tags, stateTags);
        });
        filter.expand.addEventListener('click', (e) => {// Expand state
            toggle(filter);
        });
        filter.input.addEventListener('keyup', renderFilter.bind(this));// Filter input change
    }
}
    


init();