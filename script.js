window.onload = () => {
  // Retrieve categories from local storage
  const category1 = localStorage.getItem('category1') || 'Category 1';
  const category2 = localStorage.getItem('category2') || 'Category 2';
  const category3 = localStorage.getItem('category3') || 'Category 3';
  const category4 = localStorage.getItem('category4') || 'Category 4';

  // get dom elements to display data on screen
  const extensionBody = document.getElementById('body'); // to handle blur function
  const inputDescription = document.getElementById('input-description');
  const saveBtn = document.getElementById('save-btn');
  const getLeads = document.getElementById('get-leads');

  // Create category element
  const categoryElement = document.createElement('p');
  categoryElement.id = 'category';

  // Get DOM elements for the buttons
  const button1 = document.getElementById('button1');
  const button2 = document.getElementById('button2');
  const button3 = document.getElementById('button3');
  const button4 = document.getElementById('button4');

  // Set the active category initially
  let activeCategory = category1;

  // Load category names into buttons
  button1.innerHTML = category1;
  button2.innerHTML = category2;
  button3.innerHTML = category3;
  button4.innerHTML = category4;

  // Edit buttons
  button1.addEventListener('dblclick', () => {
    enableButtonEdit(button1, 'category1');
    setActiveCategory(category1);
    renderLeads();
  });
  button1.addEventListener('click', () => {
    setActiveCategory(category1);
    renderLeads();
  });

  button2.addEventListener('dblclick', () => {
    enableButtonEdit(button2, 'category2');
    setActiveCategory(category2);
    renderLeads();
  });
  button2.addEventListener('click', () => {
    setActiveCategory(category2);
    renderLeads();
  });

  button3.addEventListener('dblclick', () => {
    enableButtonEdit(button3, 'category3');
    setActiveCategory(category3);
    renderLeads();
  });
  button3.addEventListener('click', () => {
    setActiveCategory(category3);
    renderLeads();
  });

  button4.addEventListener('dblclick', () => {
    enableButtonEdit(button4, 'category4');
    setActiveCategory(category4);
    renderLeads();
  });
  button4.addEventListener('click', () => {
    setActiveCategory(category4);
    renderLeads();
  });

  // Set active category
  const setActiveCategory = (category) => {
    activeCategory = category;
    categoryElement.textContent = activeCategory;
  };
  // change category on button
  const categories = document.querySelector('.categories-container');
  const enableButtonEdit = (button, storageKey) => {
    const inputBox = document.createElement('div');
    inputBox.id = 'inputbox';
    inputBox.className = 'input-box';
    const saveIcon = document.createElement('span');
    saveIcon.id = 'saveicon';
    saveIcon.className = 'material-symbols-outlined';
    saveIcon.textContent = 'save';
    const input = document.createElement('input');
    input.id = 'input';
    input.className = 'categorie-input';

    inputBox.appendChild(input);
    inputBox.appendChild(saveIcon);
    categories.appendChild(inputBox);

    button.textContent = '';
    input.value = button.textContent;
    // save category after change
    const saveChanges = () => {
      const newText = input.value;
      button.textContent = newText;
      localStorage.setItem(storageKey, newText);
      renderLeads();
      location.reload();
    };
    const handleKeydown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveChanges();
        location.reload();
      }
    };
    saveIcon.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('clicked');
      saveChanges();
      location.reload();
    });
    // reset to homescreen after accidently dblclick on category btns
    const handleBlur = () => {
      inputBox.removeChild(saveIcon);
      inputBox.removeChild(input);
      categories.removeChild(inputBox);
      setActiveCategory(activeCategory);
      location.reload();
    };
    // clickevent to hide inputfield
    extensionBody.addEventListener('click', (event) => {
      if (!inputBox.contains(event.target)) {
        handleBlur();
      }
    });
    input.addEventListener('keydown', handleKeydown);
  };

  // Getting the leads for display
  let myLeads = [];
  // Save button click event
  saveBtn.addEventListener('click', (event) => {
    event.preventDefault();
    // grab url from current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      myLeads.push(tabs[0].url);
      localStorage.setItem(activeCategory, JSON.stringify(myLeads));
      renderLeads();
    });
    myLeads.push(inputDescription.value);
    localStorage.setItem(activeCategory, JSON.stringify(myLeads));
    renderLeads();
  });

  // Render leads
  const renderLeads = () => {
    getLeads.innerHTML = '';
    myLeads = JSON.parse(localStorage.getItem(activeCategory)) || [];

    const title = document.createElement('h2');
    title.textContent = activeCategory;
    getLeads.appendChild(title);

    for (let i = 0; i < myLeads.length; i += 2) {
      const leadsContainer = document.createElement('div');
      leadsContainer.className = 'leads-container';
      urlBox = document.createElement('div');
      urlBox.className = 'url-box';

      const text = document.createElement('p');
      text.className = 'textbox';
      text.textContent = myLeads[i];

      const category = document.createElement('p');
      category.className = 'categorybox';
      category.textContent = activeCategory;

      const url = document.createElement('a');
      url.href = myLeads[i + 1];
      url.textContent = myLeads[i + 1];
      url.target = '_blank';
      url.className = 'link';

      const deleteItem = document.createElement('button');
      deleteItem.className = 'delete-item-btn';
      const deleteIcon = document.createElement('span');
      deleteIcon.className = 'material-symbols-outlined';
      deleteIcon.textContent = 'delete';
      deleteItem.appendChild(deleteIcon);

      deleteItem.addEventListener('dblclick', () => {
        deleteSpecificItem(i);
        renderLeads();
      });

      leadsContainer.appendChild(text);
      leadsContainer.appendChild(category);
      leadsContainer.appendChild(deleteItem);
      leadsContainer.appendChild(urlBox);
      urlBox.appendChild(url);

      getLeads.appendChild(leadsContainer);
    }
    const deleteAll = document.createElement('button');
    deleteAll.className = 'delete-all-btn';
    deleteAll.textContent = 'Delete all';
    // Delete all items
    deleteAll.addEventListener('dblclick', () => {
      localStorage.removeItem(activeCategory);
      renderLeads();
    });
    if (myLeads && myLeads.length > 0) {
      // to show button only when localstorage has items
      deleteAll.style.display = 'block';
    } else {
      deleteAll.style.display = 'none';
    }
    getLeads.appendChild(deleteAll);
  };

  // Delete a specific item from the leads array
  const deleteSpecificItem = (index) => {
    const updatedLeads = JSON.parse(localStorage.getItem(activeCategory)) || [];

    if (index >= 0 && index < updatedLeads.length) {
      updatedLeads.splice(index, 2);
    }

    localStorage.setItem(activeCategory, JSON.stringify(updatedLeads));
  };
};
