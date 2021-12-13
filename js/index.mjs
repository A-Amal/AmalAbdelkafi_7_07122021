import Recipe from "./model/recipe.mjs";
import recipesData from "./recipes.mjs";

async function fetchData(recipesData) {
    let recipesTab = []
    recipesData.array.forEach(recipeData => {
        recipesTab.push(new Recipe(recipeData))
    });
    return recipesTab
}
function renderRecipes(tab) {
    const recipesDom = document.querySelector(".recipes")
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
async function init() {
    renderRecipes(recipesData);
    const search= document.querySelector('[data-search]');
    search.addEventListener("keyup", ()=>{
      
        const tab = filterSearch(recipesData)
        console.log(tab)
            
    })
    
}

init();