class ViewBubble{
    constructor(bubble){
        this.data = bubble;
        this.xPos = random(100, width - 100);
        this.yPos = random(100, height- 100);
        
        this.radius = 100;
        this.isActive = true;
        this.color = color("#99aaff");

        this.anchoredTo = [];
    }

    static constructBubble(bubble, children){
        this.bubble = bubble;
        return this;
    }

    changePos(xPos, yPos){
        this.xPos = xPos;
        this.yPos = yPos;
    }
}