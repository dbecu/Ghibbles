class Bubble{
    constructor(id, name, color, imageUrl, type){
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.color = color;
        this.type = type;

        this.directChildren = [];
    }

    addDirectChildren(bubbles){
        this.directChildren.push(bubbles);
    }
}