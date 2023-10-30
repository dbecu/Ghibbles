class ViewBubble{
    constructor(bubble){
        this.bubble = bubble;
        this.xPos = random(width);
        this.yPos = random(height);
        
        this.radius = 50;
        this.isActive = false;
        this.color = color("#99aaff");
        
        this.children = [];
    }

    static constructBubble(bubble, children){
        this.bubble = bubble;
        this.children = children;
        return this;
    }

    changePos(xPos, yPos){
        this.xPos = xPos;
        this.yPos = yPos;
    }

    addToChildren(viewBubble){
        this.children.push(viewBubble);
    }
}