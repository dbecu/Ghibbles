class BubbleParser{

    static parse(jsonText){
        let bubbleList = [];

        for (let i = 0; i < jsonText.length; i++){
            bubbleList.push(this.parseSingleBubble(jsonText[i]));
        }

        return bubbleList;
    }

    static parseSingleBubble(jsonText){
        return new Bubble(jsonText.id, jsonText.name, jsonText.parentId);
    }

    static parseToViewBubble(bubbleList){
        let parentBubbles = bubbleList
            .filter((bubble) => bubble.parentId == 0)
            .map((bubble) => new ViewBubble(bubble));
            
        parentBubbles.forEach(viewBubble => {
            viewBubble.children = (this.recursive(bubbleList, viewBubble));
        });
    
        return parentBubbles;
    }

    static recursive(bubbleList, viewBubble){
        let found = bubbleList
            .filter((childBubble) => childBubble.parentId == viewBubble.bubble.id)
            .map((childBubble) => new ViewBubble(childBubble) );

        if (found.length <= 0) 
            return []; 

        found.forEach(foundBubble => {
            foundBubble.children = (this.recursive(bubbleList, foundBubble));
        });

        return found;
    }

}