class BubbleDatabase{

    // Select requests
    selectGenres(){
        var clause = ""
            + `SELECT * FROM bubbles `
            + `INNER JOIN genres ON bubbles.id = genres.id`;

        return this.sendRequest(clause);
    }

    selectSubgenres(genreId){
        var clause = ""
        + `SELECT * FROM bubbles `
        + `INNER JOIN subgenres ON bubbles.id = subgenres.id `
        + `WHERE subgenres.genreId=${genreId}`;

        return this.sendRequest(clause);
    }

    selectMovies(subgenreId){
        var clause = ""
        + `SELECT * FROM bubbles `
        + `INNER JOIN subgenreMovieLink ON bubbles.id = subgenreMovieLink.movieId `
        + `WHERE subgenreMovieLink.subgenreId=${subgenreId} `;
        
        return this.sendRequest(clause);
    }

    selectCharacters(movieId){
        var clause = ""
        + `SELECT * FROM bubbles `
        + `INNER JOIN characters ON bubbles.id = characters.id `
        + `WHERE characters.movieId=${movieId}`;

        return this.sendRequest(clause);
    }

    selectAttributes(id){
        var clause = ""
        + `SELECT * FROM bubbles `
        + `INNER JOIN linkedAttribute ON bubbles.id = linkedAttribute.attributeId `
        + `WHERE linkedAttribute.instanceId=${id}`;

        return this.sendRequest(clause);
    }


    sendRequest(clause){
        // console.log(clause);
        return alasql(clause);
    }

    createDatabase(){
         console.log("-- Database with Tables created --");  

         this.createAllTables();
         this.addInstances();
    }

    createAllTables(){
        alasql("CREATE TABLE bubbles (name string, color string, imageUrl string, id number)"); 
        alasql("CREATE TABLE genres (id number)"); 
        alasql("CREATE TABLE subgenres (id number, genreId number)"); 
        alasql("CREATE TABLE movies (id number)"); 
        alasql("CREATE TABLE subgenreMovieLink (subgenreId number, movieId number)"); 
        alasql("CREATE TABLE characters (id number, movieId number)"); 
        alasql("CREATE TABLE environments (id number, movieId number)"); 
        alasql("CREATE TABLE objects (id number, movieId number)"); 
        alasql("CREATE TABLE motifs (id number, movieId number)"); 
        alasql("CREATE TABLE attributes (id number)"); 
        alasql("CREATE TABLE linkedAttribute (attributeId number, instanceId number)"); 
    }

    addToTable(tableName, valueArray){
        let values = "(";
        for (let value of valueArray) {
            if (!isNaN(value)) {
                value = parseInt(value, 10);
            }        

            if (typeof value === 'string') {
                values += `"${value}",`
            }
            else {
                values += `${value},`
            }
        }
        values = values.slice(0, -1) + ")";

        let request = `INSERT INTO ${tableName} VALUES ${values}`;
        // console.log(request);
        alasql(request);
    }

    addInstances(){
        //Bubbles
        this.addToTable("bubbles", ["Howls Moving Castle", "#4287f5", "img/howl.png", 1]);
        this.addToTable("bubbles", ["Kikis Delivery Service", "#4287f5", "url", 2]);
        this.addToTable("bubbles", ["Ponyo", "#4287f5", "url", 3]);
        this.addToTable("bubbles", ["Howl", "#4287f5", "url", 4]);
        this.addToTable("bubbles", ["Sohpie", "#4287f5", "url", 5]);
        this.addToTable("bubbles", ["Calcifer", "#4287f5", "url", 6]);
        this.addToTable("bubbles", ["Brave", "#4287f5", "url", 7]);
        this.addToTable("bubbles", ["Sassy", "#4287f5", "url", 8]);
        this.addToTable("bubbles", ["Demon", "#4287f5", "url", 9]);
        this.addToTable("bubbles", ["Witch", "#4287f5", "url", 10]);
        this.addToTable("bubbles", ["Kiki", "#4287f5", "url", 11]);
        this.addToTable("bubbles", ["Jiji", "#4287f5", "url", 12]);
        this.addToTable("bubbles", ["Curious", "#4287f5", "url", 13]);
        this.addToTable("bubbles", ["Romance", "#ff0000", "url", 14]);
        this.addToTable("bubbles", ["Adventure", "#00ff5e", "url", 15]);
        this.addToTable("bubbles", ["Fantasy", "#d000ff", "url", 16]);
        this.addToTable("bubbles", ["Fantasy Romance", "#4287f5", "url", 17]);
        this.addToTable("bubbles", ["Fairy Tale Romance", "#4287f5", "url", 18]);
        this.addToTable("bubbles", ["Young Adult", "#4287f5", "url", 19]);
        this.addToTable("bubbles", ["Epic Adventure", "#4287f5", "url", 20]);
        this.addToTable("bubbles", ["Quest Adventure", "#4287f5", "url", 21]);
        this.addToTable("bubbles", ["Steampunk Fantasy", "#4287f5", "url", 22]);
        this.addToTable("bubbles", ["Magical Realism", "#4287f5", "url", 23]);
        this.addToTable("bubbles", ["Witchcraft Fantasy", "#4287f5", "url", 24]);

        //genres
        this.addToTable("genres", [14]);
        this.addToTable("genres", [15]);
        this.addToTable("genres", [16]);

        //subgenres
        this.addToTable("subgenres", [17, 14]);
        this.addToTable("subgenres", [18, 14]);
        this.addToTable("subgenres", [19, 14]);
        this.addToTable("subgenres", [20, 15]);
        this.addToTable("subgenres", [21, 15]);
        this.addToTable("subgenres", [22, 16]);
        this.addToTable("subgenres", [23, 16]);

        //movies
        this.addToTable("movies", [1]);
        this.addToTable("movies", [2]);
        this.addToTable("movies", [3]);

        //subgenreMovieLink
        this.addToTable("subgenreMovieLink", [17, 1]);
        this.addToTable("subgenreMovieLink", [18, 1]);
        this.addToTable("subgenreMovieLink", [19, 1]);
        this.addToTable("subgenreMovieLink", [20, 1]);
        this.addToTable("subgenreMovieLink", [21, 1]);
        this.addToTable("subgenreMovieLink", [22, 1]);
        this.addToTable("subgenreMovieLink", [23, 1]);
        this.addToTable("subgenreMovieLink", [24, 1]);
        this.addToTable("subgenreMovieLink", [21, 2]);
        this.addToTable("subgenreMovieLink", [21, 3]);
        this.addToTable("subgenreMovieLink", [23, 3]);
        this.addToTable("subgenreMovieLink", [24, 3]);

        //attributes
        this.addToTable("attributes", [7]);
        this.addToTable("attributes", [8]);
        this.addToTable("attributes", [9]);
        this.addToTable("attributes", [7]);
        this.addToTable("attributes", [10]);
        this.addToTable("attributes", [13]);


        //characters
        this.addToTable("characters", [3, 3]);
        this.addToTable("characters", [4, 1]);
        this.addToTable("characters", [5, 1]);
        this.addToTable("characters", [6, 1]);
        this.addToTable("characters", [11, 2]);
        this.addToTable("characters", [12, 2]);

        //linkedAttribute
        this.addToTable("linkedAttribute", [7, 3]);
        this.addToTable("linkedAttribute", [7, 5]);
        this.addToTable("linkedAttribute", [7, 11]);
        this.addToTable("linkedAttribute", [8, 5]);
        this.addToTable("linkedAttribute", [13, 5]);
        this.addToTable("linkedAttribute", [9, 6]);
        this.addToTable("linkedAttribute", [10, 11]);
        this.addToTable("linkedAttribute", [10, 4]);

    }
}