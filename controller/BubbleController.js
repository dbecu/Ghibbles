class BubbleController{
    #database;

    constructor(){
        this.database = new Database();
    }

    getAllBubbles(){
        return this.database.getAllBubbles();
    }


}