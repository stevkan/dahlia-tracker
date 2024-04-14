const SelectOptions = (function () {
  'use strict;'

  const publicAPIs = {};

  publicAPIs.locationIds = function () {
    // const location = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const sublocation = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];
    let locations = ``;

    location.forEach((loc) => {
      sublocation.forEach((subloc) => {
        const option = document.createElement('option');
        option.classList.add('locationIdOption');
        option.value = `${loc}${subloc}`; 
        option.text = `${loc}${subloc}`; 
        selectLocationIds.appendChild(SelectOptions.locationIds());
      });
    });
    console.log(locations);
    return locations;

    return `
      <option ${
        row[item] === 'A1' ? 'selected' : ''
      } class='locationIdOption' value='A1'>A1</option>
      <option ${
        row[item] === 'A2' ? 'selected' : ''
      } class='locationIdOption' value='A2'>A2</option>
      <option ${
        row[item] === 'A3' ? 'selected' : ''
      } class='locationIdOption' value='A3'>A3</option>
      <option ${
        row[item] === 'A4' ? 'selected' : ''
      } class='locationIdOption' value='A4'>A4</option>
      <option ${
        row[item] === 'A5' ? 'selected' : ''
      } class='locationIdOption' value='A5'>A5</option>
      <option ${
        row[item] === 'A6' ? 'selected' : ''
      } class='locationIdOption' value='A6'>A6</option>
    `
  }

  return publicAPIs;
})();
