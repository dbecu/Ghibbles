class Parser{
    static parse(json, type){
        return new Bubble(json.id, json.name, json.url, type)
    }
}