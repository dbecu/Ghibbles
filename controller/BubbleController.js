class BubbleController{
    #database;
    
    static #instance;

    constructor(){
        this.#database = new Database();
    }

    async loadDb(){
        await this.#database.loadAllTables();
    }
    
    static getInstance(){
        if (this.#instance == null) {
            this.#instance = new BubbleController();
        }
        return this.#instance;
    }

    getAllBubbles(){
        // return this.#bubbles;
        return this.#database.getAllBubbles();
    }

    getImages(){
        let images = this.#database.getImages();
        return images;
    }

}