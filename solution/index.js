
    /* Global Variables */

let inputtedText, list, originalText, chosenTask, removedTask, currentList, newList,
 pressedKeys = {
    Alt: false,
    "1": false,
    "2": false,
    "3": false,
  };

  /* ul lists from DOM */
const todo = document.getElementById("toDoList");
const progress = document.getElementById("progressList");
const done = document.getElementById("doneList");
const container = document.getElementById("container");
const searchBar = document.getElementById("search");  
let tasksArr = [];


            /* Object to manipulate local storage*/
let tasksStorage = JSON.parse(localStorage.getItem("tasks"));

    /* The function to start the show */
initialFromLocalStorage();

function initialFromLocalStorage(){
    if(tasksStorage!==null)
        displayFromStorage();
    else {
        setStorageArrays();
    }
 }


 function displayFromStorage(){
    let count = 0;
        for(let i = 0; i < tasksStorage.todo.length; i++){       // in each array
              tasksArr.push(tasksStorage.todo[i]);          // use in searchBar
              todo.append(createTaskElement(count, tasksStorage.todo[i]));
              count++;
          }

         for(let i = 0; i < tasksStorage["in-progress"].length; i++){       // in each array
            tasksArr.push(tasksStorage["in-progress"][i]);      // use in searchBar
            progress.append(createTaskElement(count, tasksStorage["in-progress"][i]));
            count++; 
        }

        for(let i = 0; i < tasksStorage.done.length; i++){       // in each array
            tasksArr.push(tasksStorage.done[i]);    // use in searchBar
            done.append(createTaskElement(count, tasksStorage.done[i]));
            count++;
        }
      }


    /* called if local storage is empty */
function setStorageArrays(){
    localStorage.setItem("tasks",JSON.stringify({
        "todo": [],
        "in-progress": [],
        "done": []
      }));
       tasksStorage = JSON.parse(localStorage.getItem("tasks"));
 }

 /* use in edit task content. gets the text before change */
 function getOriginalText(e){
    if(e.target.tagName!=="LI") return;
    originalText = e.target.innerText;   // The text before change
 }


function handleTaskContentEdit(e){
    if(e.target.tagName!=="LI") return;     // if its not an li do nothing
    let newText = e.target.innerText;
     
        if((e.target.closest("#toDoList"))){        // check which list

            /* replacing in local storage */
            let index = tasksStorage.todo.indexOf(originalText);

            if(index === (-1)) return;
            tasksStorage.todo[index] = newText;

            updateStorage();
             return;
        }

        if((e.target.closest("#progressList"))){     // check which list

             /* replacing in local storage */
            let index = tasksStorage["in-progress"].indexOf(originalText)

            if(index === (-1)) return;
            tasksStorage["in-progress"].splice(index, 1, newText);

            updateStorage();
             return;
        }

        if((e.target.closest("#doneList"))){    // check which list

             /* replacing in local storage */
            let index = tasksStorage.done.indexOf(originalText);

            if(index === (-1)) return;
             tasksStorage.done.splice(index, 1, newText);

             updateStorage(); return;
        }
}


        /* handle button clicks with event delegation */

function handleAddTaskEvent(e) {
    
    if(e.target.id === "submit-add-to-do"){

                        /* Getting and checking input */
        inputtedText = document.getElementById("add-to-do-task").value;
        tasksArr.push(inputtedText);
        if(inputtedText===""){ alert("please insert Some text"); return;}

                            /*Getting the right list */
             list = document.querySelector(".to-do-tasks");

        const newId = generateId();
        addTask( newId, inputtedText, list);      // adding task with the right list and text
        }


    if(e.target.id === "submit-add-in-progress"){

                          /* Getting and checking input */
        inputtedText = document.getElementById("add-in-progress-task").value;
        tasksArr.push(inputtedText);
        if(inputtedText===""){ alert("please insert Some text"); return;}

                     /*Getting the right list */
            list = document.querySelector(".in-progress-tasks");
        const newId = generateId();
        addTask(newId, inputtedText, list);       // adding task with the right list and text
        }


    if(e.target.id === "submit-add-done"){
                      /* Getting and checking input */
        inputtedText = document.getElementById("add-done-task").value;
        tasksArr.push(inputtedText);
        if(inputtedText===""){ alert("please insert Some text"); return;}

                     /*Getting the right list */
         list = document.querySelector(".done-tasks");
        const newId = generateId();
        addTask( newId, inputtedText, list);       // adding task with the right list and text
        }
 return;
}


function addTask(id, userText, list) {
        /* Creating new task element */
    const newTask = createTaskElement(id, userText) ;        
         
    
          /* Appending to the right list */
    list.prepend(newTask);

        /*  Adding to local storage */
       switch(list.id){
        case "toDoList":
           tasksStorage.todo.unshift(userText);
            break;
        case "progressList":
            tasksStorage["in-progress"].unshift(userText);
            break;
        case "doneList":
            tasksStorage.done.unshift(userText);
            break;
        default:
        console.log("Sorry");
       }
       updateStorage();
    return newTask.id;
}


function createTaskElement(id, taskText){
    const classes = ["task"];
    const attrs = {id: id, contenteditable: "true"};
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
  
/* generates ID based on how many tasks exists */
  function generateId(){
    let count = 0;
    try{
    for(let taskArr in tasksStorage){       // iterate through object properties
        for(let i = 0; i < tasksStorage[taskArr].length; i++){       // in each array
            count++;
        }
    }
    if(document.getElementById(`${count}`)!==null) return count +1;
    return count;

    }
    catch{          // if the arrays are empty
    return count;
    }
    
  }
          
      
    

      /* gets a ul list ID and returning the right array name from tasksStorage */
    function parentList(listId){
    switch(listId){
        case "toDoList":
            return "todo"
                
        case "progressList":
            return "in-progress"
                
        case "doneList":
            return "done"

        default:
        console.log("There Seems To Be A Problem");
           }
      }
  


                /* event listeners with event delegation */

        container.addEventListener("click", handleAddTaskEvent);

        document.addEventListener('focus', getOriginalText, true);

        document.addEventListener('blur', handleTaskContentEdit, true);




        /* ---- moving Tasks with keyboard ---- */
          

            /*  called from keydown event */

    function moveToList(event){

                /* assigning new values */
    if (event.key === "Alt") {
              pressedKeys.Alt = true;
        }
    if (event.key === "1") {
              pressedKeys["1"] = true;
        }
    if (event.key === "2") {
                pressedKeys["2"] = true;
        }
    if (event.key === "3") {
                pressedKeys["3"] = true;
        }

              
        if(pressedKeys.Alt && pressedKeys["1"]){         // if Alt + 1 is pressed

            currentList = parentList(chosenTask.parentElement.id);   // understand from which list an element is moving
            taskContent = chosenTask.textContent;
    
                            /* Replacing in local Storage */  
            removedTask = tasksStorage[currentList].splice(tasksStorage[currentList].indexOf(taskContent), 1);
            tasksStorage.todo.unshift(removedTask[0]);


            todo.prepend(chosenTask);    //  replacing in DOM
            updateStorage();
            return;
          }

        if(pressedKeys.Alt && pressedKeys["2"]){         // if Alt + 2 is pressed


            currentList = parentList(chosenTask.parentElement.id);   // understand from which list an element is moving
            taskContent = chosenTask.textContent;

                          /* Replacing in local Storage*/
            removedTask = tasksStorage[currentList].splice(tasksStorage[currentList].indexOf(taskContent), 1);
            tasksStorage["in-progress"].unshift(removedTask[0]);


            progress.prepend(chosenTask);  //  replacing in DOM
            updateStorage(); 
            return;
          }

        if(pressedKeys.Alt && pressedKeys["3"]){            // if Alt + 3 is pressed


            currentList = parentList(chosenTask.parentElement.id);   // understand from which list an element is moving
            taskContent = chosenTask.textContent;

                 /* Replacing in local Storage*/
            removedTask = tasksStorage[currentList].splice(tasksStorage[currentList].indexOf(taskContent), 1);
            tasksStorage.done.unshift(removedTask[0]);
            
                
            done.prepend(chosenTask);  //  replacing in DOM
            updateStorage()
            return;
          }
        }
          
          
         
                    /* called from keyup event */
        function settingPressedKeys(event){

        if (event.key === "Alt") {
            pressedKeys.Alt = false;
        }
        if (event.key === "1") {
            pressedKeys["1"] = false;
        }
        if (event.key === "2") {
            pressedKeys["2"] = false;
        }
        if (event.key === "3") {
            pressedKeys["3"] = false;
        }
            return;
    }
         
                            /*  detecting mouse hovering */

document.addEventListener(("mouseover"), function(event) {
        if(event.target.tagName==="LI"){        // if the mouse hovers a task allow it to change location
            chosenTask = event.target;              
            document.addEventListener("keydown", moveToList);
            document.addEventListener("keyup", settingPressedKeys);
        }
        else {
            chosenTask = undefined;
            document.removeEventListener("keyup", settingPressedKeys);
            document.removeEventListener("keydown", moveToList);
        }

        return; 
        }, true); 

                
    /* ---- searching tasks ---- */

    searchBar.addEventListener("keyup", (e)=>{              // when the searched value changes
        const searchValue = e.target.value.toLowerCase();   // gets the value in lower case
        const filteredTasks = tasksArr.filter(task =>{      // gets the tasks that supposed to show
            return task.toLowerCase().includes(searchValue);    
            });

    let arr = document.getElementsByTagName("li");       // gets all tasks on the page
        for(let i = 0; i < arr.length; i++){
            arr[i].style.display = "none";                     // hides them
                for(let j = 0; j < filteredTasks.length; j++){
                    if(arr[i].innerHTML===filteredTasks[j])         // if theyre text contain a value that supposed to show
                        arr[i].style.display = "list-item";         // show them
                }
            }
               
        })

        