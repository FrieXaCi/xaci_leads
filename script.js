window.onload = () => {
  // Retrieve categories from local storage
  const category1 = localStorage.getItem('category1') || 'Category 1';
  const category2 = localStorage.getItem('category2') || 'Category 2';
  const category3 = localStorage.getItem('category3') || 'Category 3';
  const category4 = localStorage.getItem('category4') || 'Category 4';

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

  const categories = document.querySelector('.categories-container');
  const enableButtonEdit = (button, storageKey) => {
    const input = document.createElement('input');
    input.classList.add = 'category-btn';
    categories.appendChild(input);
    button.textContent = '';
    input.value = button.textContent;

    const saveChanges = () => {
      const newText = input.value;
      button.textContent = newText;
      localStorage.setItem(storageKey, newText);
      button.parentElement.removeChild(input);
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

    const handleBlur = () => {
      button.parentElement.removeChild(input);
      setActiveCategory(activeCategory);
      location.reload();
    };

    input.addEventListener('keydown', handleKeydown);
    input.addEventListener('blur', handleBlur);
    input.focus();
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

      const text = document.createElement('p');
      text.textContent = myLeads[i];

      const category = document.createElement('p');
      category.textContent = activeCategory;

      const url = document.createElement('a');
      url.href = myLeads[i + 1];
      url.textContent = myLeads[i + 1];
      url.target = '_blank';

      const deleteItem = document.createElement('button');
      deleteItem.className = 'delete-item-btn';
      const deleteIcon = document.createElement('span');
      deleteIcon.className = 'material-symbols-outlined';
      deleteIcon.textContent = 'delete';
      deleteItem.appendChild(deleteIcon);

      deleteItem.addEventListener('click', () => {
        deleteSpecificItem(i);
        renderLeads();
      });

      leadsContainer.appendChild(text);
      leadsContainer.appendChild(category);
      leadsContainer.appendChild(deleteItem);
      leadsContainer.appendChild(url);

      getLeads.appendChild(leadsContainer);
    }
    const deleteAll = document.createElement('button');
    deleteAll.textContent = 'Delete all';
    // Delete all items
    deleteAll.addEventListener('click', () => {
      localStorage.removeItem(activeCategory);
      renderLeads();
    });

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
