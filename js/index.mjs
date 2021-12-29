import Recipe from "./model/recipe.mjs";
import recipesData from "./recipes.mjs";
import Tag from "./model/tag.mjs";
import DomFilter from "./model/domFilter.mjs";


async function fetchData(recipesData) {
    let recipesTab = []
    recipesData.forEach(recipeData => {
        recipesTab.push(new Recipe(recipeData))
    });
    return recipesTab
}
function  renderTags (tag, stateTags, filtred) {   
    const tagsClasses = {
        ingredients: 'primary',
        appliances: 'success',
        ustensils: 'danger'
    }
    const domTags = document.querySelector('[data-filter-tags]')
    console.log(tag)
    const elTag = tag.renderTag();
    domTags.append(elTag);
    elTag.classList.add(tagsClasses[tag.type])
    elTag.querySelector('button').addEventListener('click', (e) => removeTag(stateTags, tag, filtred));// Remove tag on click
}
function renderRecipes(tab) {
    const recipesDom = document.querySelector(".recipes")
    recipesDom.innerHTML="";
    const norecipes= document.querySelector('[data-norecipes]');
    if (tab.length == 0) {
        norecipes.style.display = '';
    }
    tab.forEach(element => {
        const dom = element.render()
        recipesDom.appendChild(dom)
    });
}
 
function filterSearch(term, recipes) {
    // Search into name, description, appliances, ingredients name, ustensils
    //const t0 = performance.now(), q = recipes.length;
    //const term = search.value.toLowerCase();
    console.log(term)
    console.log(recipes)
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
        if (!!recipe.ingredients.find((ingredient) =>ingredient.name.includes(term))) {
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

function activeIn (filtred, filter, tags, stateTags, stateFilter) {  
    console.log(stateFilter)
    console.log(filter)
    let tab = [stateFilter.ingredients, stateFilter.ustensils, stateFilter.appliances]
    console.log(tab)
    for(let fil of tab){
        console.log(typeof(fil))
        activeOut(fil)
    }
    const filterActive = filter;
    filterActive.container.classList.add('active');
    filterActive.label.style.display = 'none';
    filterActive.input.style.display = '';
    //filterActive.input.focus();
    renderFilter(filtred, filterActive, tags, stateTags);
    const domRecipes = document.querySelector('[data-recipes]')
    domRecipes.addEventListener("click", ()=>{
        for(let fil of tab){
            console.log(typeof(fil))
            activeOut(fil)
        }
    });
}
function activeOut (filter) {
    console.log(filter)
    filter.container.classList.remove('active');
    filter.container.classList.remove('expanded');
    filter.label.style.display = '';
    filter.input.style.display = 'none';
    filter.input.value = "";
    filter.results.style.display = 'none';
}
function toggle (filter, tags) {
    if (!filter) activeIn(filtred, filter, tags, stateTags);
    //Toggle visual expanded state
    //filter.container.classList.toggle('expanded');
    //filter.results.style.display = 'none';
    filter.results.innerHTML=''
    // Focus input on open
    console.log(filter.container.classList.contains('expanded'))
    if (filter.container.classList.contains('expanded')) filter.input.focus();
}
function clickOutside (e, filter, stateFilter) {
    let clickTarget = e.target;
    do {
        if (clickTarget == stateFilter.container) return;
        clickTarget = clickTarget.parentNode;
    } while (clickTarget);
    activeOut(filter);
}
function renderFilter(filtred, filter, tags, stateTags) {
    tags.ingredients = [];
    tags.ustensils = [];
    tags.appliances = [];
    const filterResult = []
    filter.results.style.display = 'none';
    filter.results.innerHTML = '';// Clean container
    filtred.forEach((item) => {
        let filterNames = filter.name;
        let name;
        item[filterNames].forEach(elemnt => {
            let filterName = filterNames.substring(0, filterNames.length - 1)
            if (filterName == "ingredient" ) { 
                if(!tags[filterNames].includes(elemnt[filterName])){
                    name =elemnt.name;
                    tags[filterNames].push(elemnt.name)
                    const tag = new Tag(name, filter.name);
                    const elTag = tag.renderLi();
                    if (filter.input.value.length > 0 && !tag.name.includes(filter.input.value.toLowerCase())) return;// Escape search result
                    elTag.addEventListener('click', (e) => {// Add tag on click
                        e.stopPropagation();
                        addTag(tag, stateTags, tags, filtred, filter);
                    })
                    if(filterResult.indexOf(tag.name) === -1){
                        filterResult.push(tag.name)
                        filter.results.append(elTag);
                    }
                    if (tagIsActive(tag, stateTags)) return;// Escape active tags
                }
            }
            else { 
                if(!tags[filterNames].includes(elemnt)){
                    tags[filterNames].push(elemnt)
                    name = elemnt
                    const tag = new Tag(name, filter.name);
                    const elTag = tag.renderLi();
                    if (filter.input.value.length > 0 && !tag.name.includes(filter.input.value.toLowerCase())) {
                        console.log(filter.input.value)
                        return
                    };// Escape search result
                    elTag.addEventListener('click', (e) => {// Add tag on click
                        e.stopPropagation();
                        addTag(tag, stateTags, tags, filtred, filter);
                    })
                    if(filterResult.indexOf(tag.name) === -1){
                        filterResult.push(tag.name)
                        filter.results.append(elTag);
                    }
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
        if (tag in tags) stateTags.splice(key, 1);
    });
    if (stateTagsLength != stateTags.length) renderTags();// Rerender on change
}
function  filterTags(filtred, stateTags) {
    console.log(stateTags)
    stateTags.forEach((tag) => {
        filtred = filtred.filter((recipe) => recipe.tagAvailable(tag));
    });
    return filtred;
}


function applyFilterRecipes (recipes, tags, stateTags, filter) {
    let filtred = [];
    console.log(stateTags)
    console.log(tags)
    if (search.value.length < 3) filtred = recipes;
    else {
        filtred = filterSearch(search.value, recipes);
    }// Search filter
    //checkStateTags (filtered, tags, stateTags)
    // Clear invalid active tags
    filtred = filterTags(filtred, stateTags);// Tags filter
    updateAvailableTags(filtred, tags);
    if (filter) renderFilter(filtred, filter, tags, stateTags);// Rerender on active
    return filtred;
}

function updateAvailableTags (filtred , tags) {
    // Reset tags
    tags.ingredients = [];
    tags.ustensils = [];
    tags.appliances = [];
    // Set new tags
    filtred.forEach((recipe) => {
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

function addTag (tag, stateTags, tags ,filtred, filter) {
    const id = tags[tag.type].findIndex((item) => item === tag.name);
    if (id >= 0) {
        stateTags.push(tag);
        tags[tag.type].splice(id, 1)
        renderTags(tag, stateTags, filtred);
        const tabFiltred = applyFilterRecipes (filtred, tags, stateTags, filter)
        renderRecipes(tabFiltred);
    }
}
function  removeTag (stateTags, tag, filtred) {
    const id = stateTags.findIndex((item) => item.name == tag.name && item.type == tag.type );
    console.log(id)
    if (id >= 0) {
        stateTags.splice(id, 1);
        renderTags(stateTags);
        renderRecipes(filtred);
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
    const recipesTab = await fetchData(recipesData);
    renderRecipes(recipesTab);
    filtred = recipesTab;
    const search= document.querySelector('[data-search]');
    search.addEventListener("keyup", ()=>{
        const tab = applyFilterRecipes(recipesTab, tags, stateTags)
        filtred = tab;    
        renderRecipes(tab)
    })
    
    let  filters= {
        ingredients: new DomFilter(document.querySelector('[data-filter="ingredients"]')),
        appliances: new DomFilter(document.querySelector('[data-filter="appliances"]')),
        ustensils: new DomFilter(document.querySelector('[data-filter="ustensils"]'))
    }
    for (const [, filter] of Object.entries(filters)) {
        filter.label.addEventListener('click', (e) => {
            console.log("active")
            console.log(filter)
            const stateFilter = filters
            activeIn(filtred, filter, tags, stateTags, stateFilter);
        });
        filter.expand.addEventListener('click', (e) => {
            console.log("toggle")
            toggle(filter);
            
        });
        filter.input.addEventListener('keyup',(e) => {
            renderFilter(filtred, filter, tags, stateTags)
        });// Filter input change
        
    }
}
    


init();