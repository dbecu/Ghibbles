class MyDatabase{

     createDatabase(){
          console.log("-- Database with Tables created --");  

          this.createTableBubble(this.createBubbleInstances());
     }

     getBubbles(){
          return alasql("SELECT * FROM bubbles");
     }

     createTableBubble(bubbleList){
          alasql("CREATE TABLE bubbles (id number, name string, parentId number)"); 

          let finalText = "";
          for (let i = 0; i < bubbleList.length; i++){
               finalText += bubbleList[i];
               if (i != bubbleList.length - 1){
                    finalText += ", ";
               }
          }  

          alasql("INSERT INTO bubbles VALUES " + finalText);
     
     }

     createBubbleInstances(){     
          let bubbleList = [];

          bubbleList.push(this.createBubbleInstance(0, "Ghibli", -1));
          bubbleList.push(this.createBubbleInstance(1, "Howls Moving Castle", 0));
          bubbleList.push(this.createBubbleInstance(2, "Kikis Delivery Service", 0));
          bubbleList.push(this.createBubbleInstance(3, "Ponyo", 0));
          bubbleList.push(this.createBubbleInstance(4, "Characters", 1));
          bubbleList.push(this.createBubbleInstance(5, "Themes", 1));
          bubbleList.push(this.createBubbleInstance(6, "Objects", 1));
          bubbleList.push(this.createBubbleInstance(7, "Environments", 1));
          bubbleList.push(this.createBubbleInstance(8, "Howl", 4));
          bubbleList.push(this.createBubbleInstance(9, "Sophie", 4));
          bubbleList.push(this.createBubbleInstance(10, "Calcifer", 4));
          bubbleList.push(this.createBubbleInstance(11, "Brave", 9));
          bubbleList.push(this.createBubbleInstance(12, "Sassy", 9));
     
          return bubbleList;
     }

     createBubbleInstance(id, name, parentId){
          return `(${id},'${name}',${parentId})`;
     }
}