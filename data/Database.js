class Database{
    
    constructor(){
        this.#loadAllTables();
    }

    #loadAllTables(){
        this.bubblesTable = this.#loadTableFormat("Bubbles");;
        this.genreTable = this.#loadTableFormat("Genre");
        this.subgenreLinkTable = this.#loadTableFormat("subgenresLink");
        this.moviesTable = this.#loadTableFormat("movies");
        this.charactersTable = this.#loadTableFormat("Ghibbles Database - characters");
        this.attributesTable = this.#loadTableFormat("Ghibbles Database - attributes");
    }

    #loadTableFormat(name){
        let path = `./data/database/${name}.csv`;
        let table = loadTable(path, "csv", "header");
        return table;
    }

    getAllBubbles(){
        this.allBubbles = [];
        let table = this.bubblesTable;

        //Getting all the bubbles
        for (var g = 0; g < table.getRowCount(); g++){
            //0 name, 1 color, 2 imagePath, 3 id
            //id, name, color, imageUrl, type
            this.allBubbles.push(new Bubble(
                parseInt(table.getRow(g).get(3)),
                table.getRow(g).get(0),
                table.getRow(g).get(1),
                table.getRow(g).get(2)
            ))
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