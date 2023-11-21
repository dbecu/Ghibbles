class BubbleController{
    static getAllViewBubbles(){
        let db = new MyDatabase();    
        return BubbleParser.parseToViewBubble(db.getBubbles());
    }


    static getAllBubbles(){
        let db = new BubbleDatabase();    
        let bubbleList = [];

        for(let genreInstance of db.selectGenres()){
            console.log(genreInstance);
            let genreBubble = Parser.parse(genreInstance, BubbleType.Genre);

            for(let subgenreInstance of db.selectSubgenres(genreBubble.id)){
                let subgenreBubble = Parser.parse(subgenreInstance, BubbleType.Subgenre);

                for(let movieInstance of db.selectMovies(subgenreBubble.id)){
                    let movieBubble = Parser.parse(movieInstance, BubbleType.Movie);
    
                    for(let characterInstance of db.selectCharacters(movieBubble.id)){
                        let characterBubble = Parser.parse(characterInstance, BubbleType.Character);
        
                        for(let attributeInstance of db.selectAttributes(characterBubble.id)){
                            let attributeBubble = Parser.parse(attributeInstance, BubbleType.Attribute);
            
                            characterBubble.addDirectChildren(attributeBubble)
                            // bubbleList.push(attributeBubble);
                        }

                        movieBubble.addDirectChildren(characterBubble)
                        // bubbleList.push(characterBubble);
                    }

                    subgenreBubble.addDirectChildren(movieBubble)
                    // bubbleList.push(movieBubble);
                }

                genreBubble.addDirectChildren(subgenreBubble)
                // bubbleList.push(subgenreBubble);
            }

            bubbleList.push(genreBubble);
        }

        console.log(bubbleList);
        return bubbleList;

    }


}