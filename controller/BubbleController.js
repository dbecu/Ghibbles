class BubbleController{
    static getAllViewBubbles(){
        let db = new MyDatabase();    
        return BubbleParser.parseToViewBubble(db.getBubbles());
    }
}