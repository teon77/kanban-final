

let originalText;


const tasksStorage = getTasks();
showTasks(tasksStorage);

function getTasks() {
    try {
      const tasks = getFromStorage();
      return validateTasks(tasks);
    } catch (e) {
      updateStorage({
        todo: [],
        'in-progress': [],
        done: [],
      });
      return getTasks();
    }
  }
  
  function getFromStorage() {
    return JSON.parse(localStorage.getItem('tasks'));
  }
 
  function validateTasks(tasks = {}) {
    const taskTypes = typeof tasks === 'object' ? Object.keys(tasks) : []; // todo, in-progress, done
  
    if (!taskTypes.includes('todo')
      || !taskTypes.includes('in-progress')
      || !taskTypes.includes('done')
    ) {
      throw new Error('Invalid Tasks Object');
    }
  
    return tasks;
  };

  function updateStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  

  function showTasks(tasks = {}) {
    const validatesTasks = validateTasks(tasks);
  
    for (const [taskType, taskList] of Object.entries(validatesTasks)) {
        console.log(taskType);
      const taskListElement = document.querySelector('.' + taskType + '-tasks');
  
      taskListElement.innerHTML = '';
  
      taskList.forEach(function(task) {
        taskListElement.appendChild(createTaskElement(task));
      });
  
    }
  }

  function createTaskElement(taskText){
    const classes = ["task"];
    const attrs = { contenteditable: "true", draggable: "true"};
    return createElement("li", taskText, classes, attrs);
}


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


  function validateTask(taskText = '') {
    if (typeof taskText === 'string' && taskText.length) {
      return taskText;
    }
  
    throw Error('Invalid Task');
  }

  function updateTasks(task, taskType) {
    const currentTasks = getFromStorage();
  
    currentTasks[taskType].unshift(validateTask(task));
    updateStorage(currentTasks);
    showTasks(currentTasks);
  }



                /* Directives */

  const submitButtons = document.getElementsByClassName('submit-task');
  

function addTaskToList(e) {
  try {
    const input = e.target.closest('section').querySelector('input');
    const taskType = e.target.dataset.type;

    updateTasks(input.value, taskType);
    input.value = '';
  } catch (e) {
    throw Error(e.message);
  }
}

for (const button of submitButtons) {
  button.addEventListener('click', addTaskToList);
}





  const TASKS_API_URI = 'https://json-bins.herokuapp.com/bin/6162f1049e72744bcfc40980';

  async function request(method = '', data = null) {
    const options = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }
  
    const response = await fetch(TASKS_API_URI, options);
  
    return response.json();
  }
  
   async function loadTasksFromApi() {
    const loaded = await request('GET', null);
  
    return loaded.tasks;
  }
  
   async function saveTasksToApi(tasks) {
    return request('PUT', {tasks});
  }


async function loadFromApi() {
    showLoader();
    const tasks = await loadTasksFromApi();
    const validatedTasks = validateTasks(tasks);
  
    showTasks(validatedTasks);
    hideLoader();
  }
  
  async function saveToApi() {
    showLoader();
    const tasks = getTasks();
  
    await saveTasksToApi(tasks);
    hideLoader();
  }

  function showLoader() {
    const loader = createElement("div", " ", ["loader"], {"id": "loader" });
    document.body.prepend(loader);

  }

  function hideLoader() {
    document.getElementById("loader").remove();
  };
  

  function getOriginalText(e) {
    if(e.target.tagName!=="LI") return;
    originalText = e.target.innerText;   // The text before change
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

  
  function handleTaskContentEdit(e) {
    if(e.target.tagName!=="LI") return;     // if its not an li do nothing
    try {
         let newText = validateTask(e.target.innerText);      //  new text given
         
         let taskList = parentList(e.target.parentElement.id); // the array from tasksStorage
         
         let index = tasksStorage[`${taskList}`].indexOf(originalText); ;
         
         if(index === (-1)) return;
         tasksStorage[`${taskList}`][index] = newText;
        
       updateStorage(tasksStorage);     // update 
       animateOnEdit(e.target)      // animation

    }
     catch(error) {
        alert (" You Cant Leave the Task Without Text");
        e.target.innerText = originalText;
        throw " You Cant Leave the Task Without Text";
    }

  }


  function animateOnEdit(task){
    task.animate([                 // animation
        // keyframes
        { transform: `translateX(1vh)` },     
        { transform: 'translateX(0vh)' },
        { transform: 'translateX(-1vh)' },
        { transform: 'translateX(0vh)' }
      ], {
        // timing options
        duration: 500,
        iterations: 2
      });
    }
  

  document.getElementById('saveBtn').addEventListener('click', saveToApi);
  document.getElementById('loadBtn').addEventListener('click', loadFromApi);


  document.addEventListener('focus', getOriginalText, true); // for changing tex
  document.addEventListener('blur', handleTaskContentEdit, true); // for changing text

  