const reader = new FileReader();
const imgInput = document.getElementById('image_url');
const thumbnailContainer = document.querySelector('#thumbnailContainer'); // Assuming you have an input element with id 'imgInput'

const inputs = {};
imgInput.addEventListener('change', async (e) => {
  const file = imgInput.files[0];
  if (!(file.name.includes(".jpg") || file.name.includes(".gif") || file.name.includes(".heic") ||file.name.includes(".png") || file.name.includes(".webp"))) {
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
    
    if (inputs.name === '' && inputs.tag_id === '' && inputs.location_id === '' && inputs.image_id) {
      alert('Required fields are missing');
      return;
    }
    
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('x-ms-version', '2023-08-03');
      reader.onload = function (e) {
        imgInput.src = file;
      }
      const imgUrl = reader.result;
      const uploadedImg = document.getElementById('image_url');
      uploadedImg.setAttribute('hidden', 'true');
      const thumbnailImg = document.querySelector('.thumbnailImg');
      thumbnailImg.removeAttribute('hidden');
      // Assuming you have an <img> element with id 'thumbnailImg'
      thumbnailImg.id = uploadedImg.files[0].name;
      thumbnailImg.src = imgUrl;
      thumbnailContainer.setAttribute('style', 'height: fit-content; width: fit-content');
    };
  }
});

const saveData = async () => {
  inputs.image_id = imgInput.files[0].name;
  inputs.image_url = null;
  inputs.name = document.getElementById('name').value !== imgInput.files[0].name ? document.getElementById('name').value.trim() : imgInput.files[0].name;
  inputs.purchased_from = document.getElementById('purchased_from').value;
  inputs.color = document.getElementById('color').value;
  inputs.height = document.getElementById('height').value;
  inputs.bloom_width = document.getElementById('bloom_width').value;
  inputs.tag_id = document.getElementById('tag_id').value;
  inputs.location_id = document.getElementById('location_id').value;
  inputs.notes = document.getElementById('notes').value;

  const saveDataToDatabase = async () => {
    try {
      inputs.image_url = reader.result;
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      
      const raw = JSON.stringify({
        inputs,
      });
      
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
    
      const response = await fetch('http://localhost:6550/createFlower', requestOptions);
      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        const msg = await response.text();
        throw new Error(msg);
      }
    } catch (err) {
      console.error(err);
      alert(`${err.message}`);
    }
  }
  await saveDataToDatabase();
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

const autocomplete = document.querySelectorAll('.createInputWrapper .autocomplete-item');

const nameInput = document.querySelector('.createInputWrapper #name');
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

const createResetButton = document.getElementById('createResetButton');

createResetButton.addEventListener('click', (e) => {
  e.preventDefault();
  location.reload(true)
});

thumbnailContainer.addEventListener('click', (e) => {
  e.preventDefault();
  imgInput.click();
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

// const selectOptions = document.querySelectorAll('.location_id option');
// selectOptions.forEach(option => {
//   option.addEventListener('click', async () => {
//     option.setAttribute('selected', true);
//     selectLocationIds.value = option.value;
//   });
// });

// const getSharedSAS = async () => {
//   try {
//     const requestOptions = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'User-Agent': 'x-fga-01',
//       },
//       redirect: 'follow',
//     };
//     const res = await fetch('http://localhost:6550/api/generateSAS', requestOptions);
//     const shared = await res.json();
//     localStorage.setItem('sharedSAS', shared.sharedAccessSignature);
//     return shared;
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// window.onload = getSharedSAS();
