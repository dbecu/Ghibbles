class NewBubble{
    constructor(id, name, imageUrl, type){
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.type = type;

        this.directChildren = [];
    }

    addDirectChildren(bubbles){
        this.directChildren.push(bubbles);
    }
}