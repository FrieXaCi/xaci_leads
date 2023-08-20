window.onload = () => {
  // Retrieve categories from local storage
  const category1 = localStorage.getItem('category1') || 'Category 1';
  const category2 = localStorage.getItem('category2') || 'Category 2';
  const category3 = localStorage.getItem('category3') || 'Category 3';
  const category4 = localStorage.getItem('category4') || 'Category 4';

  // Get DOM elements for the buttons
  const button1 = document.getElementById('button1');
  const button2 = document.getElementById('button2');
  const button3 = document.getElementById('button3');
  const button4 = document.getElementById('button4');

  // Create category element
  const categoryElement = document.createElement('p');
  categoryElement.id = 'category';

  // Set the active category initially
  let activeCategory = category1;

  // Load category names into buttons
  button1.innerHTML = category1;
  button2.innerHTML = category2;
  button3.innerHTML = category3;
  button4.innerHTML = category4;

  // Edit buttons
  button1.addEventListener('click', () => {
    enableButtonEdit(button1, 'category1');
    setActiveCategory(category1);
    renderLeads();
  });

  button2.addEventListener('click', () => {
    enableButtonEdit(button2, 'category2');
    setActiveCategory(category2);
    renderLeads();
  });

  button3.addEventListener('click', () => {
    enableButtonEdit(button3, 'category3');
    setActiveCategory(category3);
    renderLeads();
  });

  button4.addEventListener('click', () => {
    enableButtonEdit(button4, 'category4');
    setActiveCategory(category4);
    renderLeads();
  });

  // Set active category
  const setActiveCategory = (category) => {
    activeCategory = category;
    categoryElement.textContent = activeCategory;
  };

  // Enable button edit
  const enableButtonEdit = (button, storageKey) => {
    button.contentEditable = true;

    button.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        button.blur();
      }
    });

    button.addEventListener('blur', function () {
      button.contentEditable = false;
      localStorage.setItem(storageKey, button.innerHTML);
    });
  };

  // Getting the leads for display
  let myLeads = [];

  // Get DOM elements for the leads
  const inputDescription = document.getElementById('input-description');
  const saveBtn = document.getElementById('save-btn');
  const getLeads = document.getElementById('get-leads');

  // Save button click event
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myLeads.push(inputDescription.value);
    localStorage.setItem(activeCategory, JSON.stringify(myLeads));
    renderLeads();
  });

  // Render leads
  const renderLeads = () => {
    getLeads.innerHTML = '';
    myLeads = JSON.parse(localStorage.getItem(activeCategory)) || [];

    for (let i = 0; i < myLeads.length; i++) {
      const leadsContainer = document.createElement('div');
      leadsContainer.className = 'leads-container';
      const text = document.createElement('p');
      text.textContent = myLeads[i];

      const category = document.createElement('p');
      category.textContent = activeCategory;

      const url = document.createElement('a');
      url.href = myLeads[i];
      url.textContent = myLeads[i];
      url.target = '_blank';

      leadsContainer.appendChild(text);
      leadsContainer.appendChild(category);
      leadsContainer.appendChild(url);

      getLeads.appendChild(leadsContainer);
    }
  };
  /*   // Get URL for category dynamically
  const getCategoryURL = (category) => {
    // Define URLs for each category
    const categoryURLs = {
      'Category 1': 'https://www.xaci-development.com/category1',
      'Category 2': 'https://www.xaci-development.com/category2',
      'Category 3': 'https://www.xaci-development.com/category3',
      'Category 4': 'https://www.xaci-development.com/category4',
    };

    return categoryURLs[category] || '';
  }; */
};
