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
        for(let bubble of bubbles){
            //Does not add prexisting bubbles
            if (!this.directChildren.some(bub => bub.id == bubble.id)){
                this.directChildren.push(bubble);
            }
        }
    }

    addDirectChild(bubbles){
        this.directChildren.push(bubbles);
    }
}