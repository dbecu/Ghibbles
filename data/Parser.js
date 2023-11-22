class Parser{
    static parse(json, type){
        return new Bubble(json.id, json.name, color(json.color), json.url, type)
    }
}