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
        alasql("CREATE TABLE bubbles (name string, imageUrl string, id number)"); 
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
        this.addToTable("bubbles", ["Howls Moving Castle", "url", 1]);
        this.addToTable("bubbles", ["Kikis Delivery Service", "url", 2]);
        this.addToTable("bubbles", ["Ponyo", "url", 3]);
        this.addToTable("bubbles", ["Howl", "url", 4]);
        this.addToTable("bubbles", ["Sohpie", "url", 5]);
        this.addToTable("bubbles", ["Calcifer", "url", 6]);
        this.addToTable("bubbles", ["Brave", "url", 7]);
        this.addToTable("bubbles", ["Sassy", "url", 8]);
        this.addToTable("bubbles", ["Demon", "url", 9]);
        this.addToTable("bubbles", ["Witch", "url", 10]);
        this.addToTable("bubbles", ["Kiki", "url", 11]);
        this.addToTable("bubbles", ["Jiji", "url", 12]);
        this.addToTable("bubbles", ["Curious", "url", 13]);
        this.addToTable("bubbles", ["Romance", "url", 14]);
        this.addToTable("bubbles", ["Adventure", "url", 15]);
        this.addToTable("bubbles", ["Fantasy", "url", 16]);
        this.addToTable("bubbles", ["Fantasy Romance", "url", 17]);
        this.addToTable("bubbles", ["Fairy Tale Romance", "url", 18]);
        this.addToTable("bubbles", ["Young Adult", "url", 19]);
        this.addToTable("bubbles", ["Epic Adventure", "url", 20]);
        this.addToTable("bubbles", ["Quest Adventure", "url", 21]);
        this.addToTable("bubbles", ["Steampunk Fantasy", "url", 22]);
        this.addToTable("bubbles", ["Magical Realism", "url", 23]);
        this.addToTable("bubbles", ["Witchcraft Fantasy", "url", 24]);

        //genres
        this.addToTable("genres", [14]);
        this.addToTable("genres", [15]);
        this.addToTable("genres", [16]);

        //genres
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