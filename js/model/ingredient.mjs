export default class Ingredient{
    constructor(data){
        this.name = data.ingredient.toLowerCase();
        if(data.quantity){
            this.quantity = data.quantity;
        }
        if(data.unit){
            this.unit = data.unit;
        }
    }
}