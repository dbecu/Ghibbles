class Database{

    #imagePath = "./data/img/";
    #filePath = "./data/database/";
    
    constructor(){
        this.#loadAll();
    }

    async #loadAll(){
        await this.#loadAllTables();
        
        this.loadImages();
        controllerReady = true;
    }

    getImages(){
        return this.images;
    }

    loadImages(){
        this.images = {};
        this.croppedImages = {};

        console.log(this.bubblesTable);
        for (var g = 0; g < this.bubblesTable.getRowCount(); g++){

            let path = `${this.#imagePath}${this.bubblesTable.getRow(g).get(2)}`;
            this.images[this.bubblesTable.getRow(g).get(2)] = { image: loadImage(path) };
        }

        for (var g = 0; g < this.bubblesTable.getRowCount(); g++){

            let path = `${this.#imagePath}${this.bubblesTable.getRow(g).get(2)}`;
            let img = loadImage(path);
            img.mask(shape);

            this.croppedImages[this.bubblesTable.getRow(g).get(2)] = { image: img };
        }

        // this.img2 = createImage(this.data.image.width, this.data.image.height);
        // this.img2.copy(this.data.image, 0, 0, this.data.image.width, this.data.image.height, 0, 0, this.img2.width, this.img2.height);


        return this.images;
    }

    async #loadAllTables(){
        this.bubblesTable = await this.#loadTableFormat(0, true);
        this.genreTable = await this.#loadTableFormat(771251356);
        this.subgenreLinkTable = await this.#loadTableFormat(934185385);
        this.moviesTable = await this.#loadTableFormat(42305774);
        this.charactersTable = await this.#loadTableFormat(1034415048);
        this.attributesTable = await this.#loadTableFormat(398643895);

        console.log("ok??");
    }

    async #loadTableFormat(id, check = false){
        return new Promise((resolve) => {
            loadTable(this.#getOnlinePath(id), "csv", "header", (table) => {
              resolve(table);
            });
        });        
    }

    #getOnlinePath(gid){
        return `https://docs.google.com/spreadsheets/d/e/2PACX-1vREs9HN8pJOJIw3BenwHrVrBij3mDNCcPyL4DOpN4qdQHOvf7dx9qYROfhvwbyIrFLyPhL0iIfeFmLX/pub?gid=${gid}&single=true&output=csv`
    }

    getAllBubbles(){
        this.allBubbles = [];
        let table = this.bubblesTable;
        console.log(this.bubblesTable);

        //Getting all the bubbles
        for (var g = 0; g < table.getRowCount(); g++){
            //0 name, 1 color, 2 imagePath, 3 id
            //id, name, color, imageUrl, type
            let bub = new Bubble(
                parseInt(table.getRow(g).get(3)),
                table.getRow(g).get(0),
                table.getRow(g).get(1),
                table.getRow(g).get(2)
            );

            bub.image = this.images[bub.imageUrl].image;
            bub.croppedImage = this.croppedImage[bub.imageUrl].image;
            
            this.allBubbles.push(bub);
        }  

        let genres = this.#select(BubbleType.Genre, this.genreTable);

        for(let genreBubble of genres) {
            let subgenres = this.#select(BubbleType.Subgenre, this.subgenreLinkTable, genreBubble.id);

            for(let subgenreBubble of subgenres){
                let movies = this.#select(BubbleType.Movie, this.moviesTable, subgenreBubble.id);
            
                for(let movieBubble of movies){
                    let characters = this.#select(BubbleType.Character, this.charactersTable, movieBubble.id);
                    
                    for(let characterBubble of characters){
                        let attributes = this.#select(BubbleType.Attribute, this.attributesTable, characterBubble.id);
                        characterBubble.addDirectChildren(attributes);
                    }
                    
                    movieBubble.addDirectChildren(characters);
                }
                subgenreBubble.addDirectChildren(movies);
            }
            genreBubble.addDirectChildren(subgenres);
        }

        return genres;
    }

    #select(type, table, parentId = null){
        let bubbles = [];
        for (var i = 0; i < table.getRowCount(); i++){  
            //Goes through all rows
            if (parentId == null || table.getRow(i).get(1) == parentId){
                //Gets the bubble object, 0 == subgenre, 1 == genre
                let bubble = this.allBubbles.filter(bub => bub.id == table.getRow(i).get(0))[0];
                if (bubble != null){
                    bubble.type = type;
                    bubbles.push(bubble);
                }
            }
        }

        return bubbles;
    }

}