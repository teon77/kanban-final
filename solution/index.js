let inputtedText, list;
let tasksStorage = JSON.parse(localStorage.getItem("tasks"));


/*localStorage.setItem("tasks",JSON.stringify({
  "todo": [],
  "in-progress": [],
  "done": []
}));


        /* handle button clicks with event delegation */

function handleAddTaskEvent(e) {
    
    if(e.target.id === "submit-add-to-do"){

                        /* Getting and checking input */
        inputtedText = document.getElementById("add-to-do-task").value;
            if(inputtedText===""){ alert("please insert Some text"); return;}

                            /*Getting the right list */
             list = document.querySelector(".to-do-tasks");

        const newId = generateId();
        addTask( newId, inputtedText, list);      // adding task with the right list and text
        }


    if(e.target.id === "submit-add-in-progress"){

                          /* Getting and checking input */
        inputtedText = document.getElementById("add-in-progress-task").value;
        if(inputtedText===""){ alert("please insert Some text"); return;}

                     /*Getting the right list */
            list = document.querySelector(".in-progress-tasks");
        const newId = generateId();
        addTask(newId, inputtedText, list);       // adding task with the right list and text
        }


    if(e.target.id === "submit-add-done"){
                      /* Getting and checking input */
        inputtedText = document.getElementById("add-done-task").value;
        if(inputtedText===""){ alert("please insert Some text"); return;}

                     /*Getting the right list */
         list = document.querySelector(".done-tasks");
        const newId = generateId();
        addTask( newId, inputtedText, list);       // adding task with the right list and text
        }
 
}



function handleEditTaskEvent(e){
        console.log(e.target.id)
}

function addTask(id, userText, list) {
        /* Creating new task element */
    const newTask = createTaskElement( id,userText) ;        
         
    
          /* Appending to the right list */
    list.append(newTask);

        /*  Adding to local storage */
       switch(list.id){
        case "toDoList":
           tasksStorage.todo.push(userText);
            break;
        case "progressList":
            tasksStorage["in-progress"].push( userText);
            break;
        case "doneList":
            tasksStorage.done.push(userText);
            break;
        default:
        console.log("Sorry");
       }
       updateStorage();
    return newTask.id;
}



function createTaskElement(id, taskText){
    const classes = ["task"];
    const attrs = {id: id};
    return createElement("li", taskText, classes, attrs);
}

/* function creates a new element */


function createElement(tagName, text=" ", classes = [], attributes = {}) {
    const element = document.createElement(tagName);
    
    // assigning text
      element.textContent = text;
    
    // For Classes
    for(const cls of classes) {
      element.classList.add(cls);
    }
  
    // For Attributes
    for (const attr in attributes) {
      element.setAttribute(attr, attributes[attr]);
    }
    return element;
  }


   function updateStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasksStorage));
  }
  


  function generateId(){
    let count = 0;
    try{
    for(let arr in tasksStorage){       // iterate through object properties
        for(let i = 0; i < tasksStorage[arr].length; i++){       // in each array
            count++;
        }
    }
    if(document.getElementById(`${count}`)!==null) return count +1;
    return count;
}catch{
    return count;
}
    
  }
          
      
    



function displayFromStorage(){
    let todo = document.getElementById("toDoList");
    let progress = document.getElementById("progressList");
    let done = document.getElementById("doneList");
    let count = 0;
        for(let i = 0; i < tasksStorage.todo.length; i++){       // in each array
              todo.append(createTaskElement(count, tasksStorage.todo[i]));
              count++;
          }

         for(let i = 0; i < tasksStorage["in-progress"].length; i++){       // in each array
            progress.append(createTaskElement(count, tasksStorage["in-progress"][i]));
            count++; 
        }

        for(let i = 0; i < tasksStorage.done.length; i++){       // in each array
            done.append(createTaskElement(count, tasksStorage.done[i]));
            count++;
        }
      }
  
  
  displayFromStorage();

    /* event listeners with event delegation */
  document.getElementById("container").addEventListener("click", handleAddTaskEvent);
  document.getElementById("container").addEventListener("dblclick", handleEditTaskEvent);
  /* */