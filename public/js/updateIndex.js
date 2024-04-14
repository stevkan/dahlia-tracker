let row = {
  id: null,
  image_id: null,
  image_url: null,
  name: null,
  purchased_from: null,
  color: null,
  height: null,
  bloom_width: null,
  tag_id: null,
  location_id: null,
  notes: null,
};
const reader = new FileReader();
const imgInput = document.querySelector('#image_url'); // Assuming you have an input element with id 'imgInput'
const thumbnailContainer = document.querySelector('#thumbnailContainer'); // Assuming you have an input element with id 'imgInput'
const thumbnailImg = document.querySelector('.thumbnailImg');

thumbnailImg.addEventListener('click', () => {
  imgInput.click();
});

imgInput.addEventListener('change', async (e) => {
  const file = imgInput.files[0];
  if (!(file.name.endsWith(".jpg") || file.name.endsWith(".gif") || file.name.endsWith(".png") || file.name.endsWith(".webp"))) {
    alert("Only JPEG, GIF, PNG, and WEBP image types are allowed");
    return;
  }
  
  if (file) {
    thumbnailContainer.children[0].style.display = 'none';

    // Remove file extension
    let imageName = file.name.split(".")[0];
    // Replace dashes/hyphens with spaces
    imageName = imageName.replace(/[-_]/g, " ");
  
    // Capitalize first letter of each word
    imageName = imageName.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    const name = document.getElementById('name');
    name.value = imageName;
    
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      reader.onload = function (e) {
        imgInput.src = file;
      }
      thumbnailImg.src = reader.result;
      thumbnailContainer.setAttribute('style', 'height: fit-content; width: fit-content; border: white; border-style: dashed; border-width: thin;');
    };
  }
});

const importDataIntoForm = async () => {
  const editColumnId = localStorage.getItem('editColumnId');

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
  };
  const response = await fetch(
    `http://localhost:6550/getFlower/${editColumnId}`,
    requestOptions
  );
  if (response.ok) {
    row = await response.json();
    if (row) {
      const thumbnailImg = document.querySelector('.thumbnailImg');
      const inputs = document.getElementsByClassName('updateForm');

      thumbnailImg.src = row.image_url ? row.image_url : '';
      thumbnailImg.removeAttribute('hidden');
      inputs[1].value = row.id ? row.id : '';
      inputs[2].value = row.image_id ? row.image_id : ''
      inputs[3].value = row.name ? row.name : '';
      inputs[4].value = row.purchased_from ? row.purchased_from : '';
      inputs[5].value = row.color ? row.color : '';
      inputs[6].value = row.notes ? row.notes : '';
      inputs[7].value = row.height ? row.height : '';
      inputs[8].value = row.bloom_width ? row.bloom_width : '';
      inputs[9].value = row.tag_id ? row.tag_id : '';
      inputs[10].value = row.location_id ? row.location_id : '';
    }
  } else {
    alert('Error loading data');
  }

  if (row.id === null || row.id === undefined || row.id === '') {
    alert('No matching record found');
    return;
  }
};

const updateDataInDatabase = async () => {
  try {
    const thumbnailImg = document.querySelector('.thumbnailImg');
    const outputs = document.getElementsByClassName('updateForm');

    const row = {
      image_url: reader.result ? reader.result : thumbnailImg.src,  // Image Url
      // id: outputs[1].value,                                      // 1 => ID
      image_id: outputs[2].value,                                   // 2 => Image ID
      name: outputs[3].value,                                       // 3 => Name
      purchased_from: outputs[4].value,                             // 4 => Purchased From
      color: outputs[5].value,                                      // 5 => Color
      notes: outputs[6].value,                                      // 6 => Notes
      height: outputs[7].value,                                     // 7 => Height
      bloom_width: outputs[8].value,                                // 8 => Bloom Width
      tag_id: outputs[9].value,                                     // 9 => Tag ID
      location_id: outputs[10].value,                               // 10 => Location ID
      whereId: outputs[1].value,                                    // 1 => WhereId
    };
    
    if (row.name === '' || row.tag_id === '' || row.location_id === '' || row.image_id) {
      alert('Required fields are missing');
      return;
    }

    const raw = JSON.stringify({
      row,
    });
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: raw,
      redirect: 'follow',
    };
    const response = await fetch(`http://localhost:6550/updateFlower`, requestOptions);
    if (response.ok) {
      thumbnailImg.src = row.image_url;
      alert('Data saved successfully!');
    } else {
      const msg = await response.text();
      throw new Error(msg);
    }
  } catch (err) {
    console.error(err);
    alert(`${err.message}`);
  }
};

const selectHeight = document.getElementById('height');
// Add blank default option
const heightBlank = document.createElement('option');
heightBlank.value = ''; 
heightBlank.text = 'Select a height';
selectHeight.add(heightBlank);

const heightFeet = ['1','2','3','4','5','6','7','8','9'];
const heightInches = ['0','1','2','3','4','5','6','7','8','9','10','11'];

heightFeet.forEach((foot) => {
  heightInches.forEach((inch) => {
    const option = document.createElement('option');
    option.classList.add('locationIdOption');
    option.value = `${foot}'${inch}"`;
    option.text = `${foot}'${inch}"`;
    selectHeight.add(option);
  });
});

const selectBloomWidth = document.getElementById('bloom_width');
// Add blank default option
const bloomWidthBlank = document.createElement('option');
bloomWidthBlank.value = ''; 
bloomWidthBlank.text = 'Select a width';
selectBloomWidth.add(bloomWidthBlank);

const bloomWidthFeet = ['1','2','3','4','5','6','7','8','9'];
const bloomWidthInches = ['0','1','2','3','4','5','6','7','8','9','10','11'];

bloomWidthFeet.forEach((foot) => {
  bloomWidthInches.forEach((inch) => {
    const option = document.createElement('option');
    option.classList.add('locationIdOption');
    option.value = `${foot}'${inch}"`;
    option.text = `${foot}'${inch}"`;
    selectBloomWidth.add(option);
  });
});

const selectLocationIds = document.getElementById('location_id');
// Add blank default option
const locationIdsBlank = document.createElement('option');
locationIdsBlank.value = ''; 
locationIdsBlank.text = 'Select a location';
selectLocationIds.add(locationIdsBlank);

const topLevel = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const sublevel = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];

topLevel.forEach((loc) => {
  sublevel.forEach((subloc) => {
    const option = document.createElement('option');
    option.classList.add('locationIdOption');
    option.value = `${loc}${subloc}`;
    option.text = `${loc}${subloc}`;
    selectLocationIds.add(option);
  });
});

const flowerNameSuggestions = []
const getFlowerNames = getFlowers;
getFlowerNames()
  .then(flowerNames => {
    flowerNames.forEach((flower) => {
      flowerNameSuggestions.push(flower.name);
    });
  });

const autocomplete = document.querySelectorAll('.updateInputWrapper .autocomplete-item');

const nameInput = document.querySelector('.updateInputWrapper #name');
nameInput.setAttribute('autocomplete', 'off');
nameInput.addEventListener('keyup', (e) => {
  const inputValue = e.target.value;
  nameInput.innerHTML = '';
  
  const suggestionsArray = flowerNameSuggestions.filter(suggestion => {
    return suggestion.toLowerCase().includes(inputValue.toLowerCase());
  });
  
  suggestionsArray.forEach(suggestion => {
    if (e.target.value.length === 0) {
      autocomplete[0].style.display = 'none';
      autocomplete[0].setAttribute('style', 'display: none;');
      autocomplete[0].innerHTML = '';
      return;
    }
    // autocomplete[0].style.display = 'block';
    autocomplete[0].setAttribute('style', 'display: block; border: 1px solid #d4d4d4; cursor: pointer; background-color: black; width: fit-content; padding: 2px;');
    autocomplete[0].innerHTML = suggestion;
  });
});

nameInput.addEventListener('change', (e) => {
  e.target.value = e.target.value.trim();
});

nameInput.addEventListener('focusout', (e) => {
  setTimeout(() => {
    autocomplete[0].style.display = 'none';
  }, 100);
});

autocomplete[0].addEventListener('click', (e) => {
  nameInput.value = e.target.innerText;
  autocomplete[0].style.display = 'none';
});

const storeInput = document.getElementById('purchased_from');
storeInput.setAttribute('autocomplete', 'off');
const flowerStoreSuggestions = []
const getFlowerStores = getFlowers;
getFlowerStores()
  .then(flowerStores => {
    flowerStores.forEach((flower) => {
      flowerStoreSuggestions.push(flower.purchased_from);
    });
  });

storeInput.addEventListener('keyup', (e) => {
  const inputValue = e.target.value;
  storeInput.innerHTML = '';
  
  const suggestionsArray = flowerStoreSuggestions.filter(suggestion => {
    return suggestion.toLowerCase().includes(inputValue.toLowerCase());
  });
  
  suggestionsArray.forEach(suggestion => {
    if (e.target.value.length === 0) {
      autocomplete[1].style.display = 'none';
      autocomplete[1].setAttribute('style', 'display: none;');
      autocomplete[1].innerHTML = '';
      return;
    }
    autocomplete[1].style.display = 'block';
    autocomplete[1].setAttribute('style', 'display: block; border: 1px solid #d4d4d4; cursor: pointer; background-color: black; width: fit-content; padding: 2px;');
    autocomplete[1].innerHTML = suggestion;
  });
});

storeInput.addEventListener('change', (e) => {
  e.target.value = e.target.value.trim();
});

storeInput.addEventListener('focusout', (e) => {
  setTimeout(() => {
    autocomplete[1].style.display = 'none';
  }, 100);
});

autocomplete[1].addEventListener('click', (e) => {
  storeInput.value = e.target.innerText;
  autocomplete[1].style.display = 'none';
});

const colorInput = document.getElementById('color');
colorInput.setAttribute('autocomplete', 'off');
const flowerColorSuggestions = []
const getFlowerColors = getFlowers;
getFlowerColors()
  .then(flowerColors => {
    flowerColors.forEach((flower) => {
      flowerColorSuggestions.push(flower.color);
    });
  });

colorInput.addEventListener('keyup', (e) => {
  const inputValue = e.target.value;
  colorInput.innerHTML = '';
  
  const suggestionsArray = flowerColorSuggestions.filter(suggestion => {
    return suggestion.toLowerCase().includes(inputValue.toLowerCase());
  });
  
  suggestionsArray.forEach(suggestion => {
    if (e.target.value.length === 0) {
      autocomplete[2].style.display = 'none';
      autocomplete[2].setAttribute('style', 'display: none;');
      autocomplete[2].innerHTML = '';
      return;
    }
    autocomplete[2].style.display = 'block';
    autocomplete[2].setAttribute('style', 'display: block; border: 1px solid #d4d4d4; cursor: pointer; background-color: black; width: fit-content; padding: 2px;');
    autocomplete[2].innerHTML = suggestion;
  });
});

colorInput.addEventListener('change', (e) => {
  e.target.value = e.target.value.trim();
});

colorInput.addEventListener('focusout', (e) => {
  setTimeout(() => {
    autocomplete[2].style.display = 'none';
  }, 100);
});

autocomplete[2].addEventListener('click', (e) => {
  colorInput.value = e.target.innerText;
  autocomplete[2].style.display = 'none';
});

const notesInput = document.getElementById('notes');
notesInput.addEventListener('change', (e) => {
  e.target.value = e.target.value.trim();
});

const tagIdInput = document.getElementById('tag_id');
tagIdInput.addEventListener('change', (e) => {
  e.target.value = e.target.value.trim();
});

const locationIdInput = document.getElementById('location_id');
locationIdInput.addEventListener('change', (e) => {
  e.target.value = e.target.value.trim();
});

const updateResetButton = document.getElementById('updateResetButton');

updateResetButton.addEventListener('click', (e) => {
  e.preventDefault();
  location.reload(true)
});

async function getFlowers() {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  const response = await fetch('http://localhost:6550/getFlowers', requestOptions);
  if (response.ok) {
    return await response.json();
  } else {
    const msg = await response.json();
    throw new Error(msg);
  }
};

window.onload = importDataIntoForm();
