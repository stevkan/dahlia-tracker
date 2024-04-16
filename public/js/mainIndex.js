let data = [];
let selectedRow = null; // Variable to store the selected row for highlighting

// Get filter input
const filter = document.getElementById('filter');

// Add event listener
filter.addEventListener('keyup', filterRows);

function filterRows() {
  // Get value to filter by
  const value = filter.value.toLowerCase();

  // Loop through table rows
  const rows = document.querySelectorAll('#data tbody tr');
  rows.forEach(row => {
    let rowVisible = false;
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
      const cellText = cell.textContent.toLowerCase();
      if (cellText.includes(value)) {
        return (rowVisible = true);
      }
    });

    // Show or hide the row based on whether any cell contains the filter value
    row.style.display = rowVisible ? '' : 'none';
  });
}

const dataTable = document.getElementById('data');
const onContentEvent = document.createEvent('Event');
onContentEvent.initEvent('contentChange', true, true);

dataTable.dispatchEvent(onContentEvent);
dataTable.addEventListener('contentChange', e => {
  const selectElements = document.querySelectorAll('#data select');
  selectElements.forEach(selectElement => {
    const optionElement = selectElement.getElementsByTagName('option');
    selectElement.onchange = e => {
      this.className = '';
      if (e.target[0].selected === true && e.target[0].value === 'To Do') {
        selectElement.className = 'to-do';
      } else {
        optionElement[1].removeAttribute('selected');
        optionElement[2].removeAttribute('selected');
        optionElement[3].removeAttribute('selected');
        optionElement[4].removeAttribute('selected');
      }
      if (e.target[1].selected === true && e.target[1].value === 'Investigating') {
        selectElement.className = 'investigating';
      } else {
        optionElement[0].removeAttribute('selected');
        optionElement[2].removeAttribute('selected');
        optionElement[3].removeAttribute('selected');
        optionElement[4].removeAttribute('selected');
      }
      if (e.target[2].selected === true && e.target[2].value === 'Waiting on Customer') {
        selectElement.className = 'waiting-on-customer';
      } else {
        optionElement[0].removeAttribute('selected');
        optionElement[1].removeAttribute('selected');
        optionElement[3].removeAttribute('selected');
        optionElement[4].removeAttribute('selected');
      }
      if (e.target[3].selected === true && e.target[3].value === 'Waiting on Internal Task') {
        selectElement.className = 'waiting-on-internal-task';
      } else {
        optionElement[0].removeAttribute('selected');
        optionElement[1].removeAttribute('selected');
        optionElement[2].removeAttribute('selected');
        optionElement[4].removeAttribute('selected');
      }
      if (e.target[4].selected === true && e.target[4].value === 'Done') {
        selectElement.className = 'done';
      } else {
        optionElement[0].removeAttribute('selected');
        optionElement[1].removeAttribute('selected');
        optionElement[2].removeAttribute('selected');
        optionElement[3].removeAttribute('selected');
      }
    };
  });
});

const loadData = async () => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await fetch('https://dahlia-tracker.azurewebsites.net/getFlowers', requestOptions);
  if (response.ok) {
    const resp = await response.json();
    if (resp) {
      data = resp;
      setTimeout(() => {
        render(data);
      }, 50);
    }
  } else {
    alert('Error loading data');
  }
};

const deleteSelected = async (checked) => {
  const raw = JSON.stringify({
    checked,
  });
  console.log('Deleting checked:', raw);
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: raw,
    redirect: 'follow',
  };
  const response = await fetch(`https://dahlia-tracker.azurewebsites.net/deleteFlowers`, requestOptions);
  console.log('DELETE RESPONSE ', response);
  if (response.ok) {
    console.log('Successfully deleted image');
    render(data);
  } else {
    alert('Error deleting image');
  }
};

const table = document.getElementById('data');
const render = async data => {
  table.innerHTML = '';
  const header = table.createTHead();
  const headers = [
    'ID',
    'Image ID',
    'Image',
    'Name',
    'Store',
    'Clr',
    'Ht.',
    'Wd.',
    'Tag Id',
    'Loc. Id',
    'Notes',
    'Edit',
    'Delete',
  ];
  const headerRow = header.insertRow();
  const tbody = document.createElement('tbody');
  headers.forEach(headerText => {
    const cell = headerRow.insertCell();
    cell.classList.add('header');
    if (headerText === 'ID') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-1'
      cell.hidden = true;
    }
    if (headerText === 'Image ID') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-2'
      cell.hidden = true;
    }
    if (headerText === 'Image') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-3';
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Name') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-4';
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Store') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-5';
      cell.hidden = true;
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Clr') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-6';
      cell.hidden = true;
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Ht.') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-7';
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Wd.') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-8';
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Tag Id') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-9';
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Loc. Id') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-10';
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Notes') {
      cell.innerHTML = `<b>${headerText}</b>`;
      cell.id = 'col-11';
      cell.hidden = true;
      cell.onclick = () => {
        data.sort((a, b) => {
          if (headerText !== 'Edit' || headerText !== 'Delete') {
            a[headerText] > b[headerText] ? 1 : -1;
          }
        });
        render(data);
      };
    }
    if (headerText === 'Edit') {
      cell.innerHTML = '<input id="updateButton" type="button" name="Edit" value="Edit" />';
      cell.id = 'col-12';
    }
    if (headerText === 'Delete') {
      cell.innerHTML = '<input id="deleteButton" type="button" name="Delete" value="Del" />';
      cell.id = 'col-13';
    }
  });

  data.forEach(async (row, i) => {
    table.appendChild(tbody);
    const rowElement = tbody.insertRow();
    for (const item in row) {
      if (item === 'created_at' || item === 'updated_at') {
        continue;
      }
      const cell = rowElement.insertCell();
      if (item === 'id') {
        cell.innerHTML = row['id'];
        cell.hidden = true;
      }
      if (item === 'image_id') {
        cell.innerHTML = row['image_id'];
        cell.hidden = true;
      }
      if (item === 'image_url') {
        const img = document.createElement('img');
        img.src = row['image_url'];
        img.width = "50";
        img.height = "50";
        img.alt = "flower";
        cell.appendChild(img);
        cell.style.maxWidth = "60px";
        cell.style.maxHeight = "60px";
        cell.style.cursor = 'pointer';
        cell.onclick = () => {
          const html = `<!DOCTYPE html>
            <html>
              <head>
                <title>Flower Popout</title>
                <style>
                  html {
                    height: 100%;
                    width: 100%;
                  }
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: black;
                    overflow: hidden;
                  }
                  .flowerPopout {
                    object-fit: contain;
                  }
                </style>
              </head>
              <body>
                <img class="flowerPopout" src="${row['image_url']}" alt="flower popout">
              </body>
            </html>
          `;

          const blob = new Blob([html], {type: 'text/html'});  
          const url = URL.createObjectURL(blob);

          window.open(url, '_blank', 'popup,toolbar=no,location=no,statusbar=no,menubar=no,resizable=yes' );
        };
      }
      if (item === 'name') {
        cell.innerHTML = row['name'];
      }
      if (item === 'purchased_from') {
        cell.innerHTML = row['purchased_from'];
        cell.hidden = true;
      }
      if (item === 'color') {
        cell.innerHTML = row['color'];
        cell.hidden = true;
      }
      if (item === 'height') {
        cell.innerHTML = row['height'];
      }
      if (item === 'bloom_width') {
        cell.innerHTML = row['bloom_width'];
      }
      if (item === 'tag_id') {
        cell.innerHTML = row['tag_id'];
      }
      if (item === 'location_id') {
        cell.innerHTML = row['location_id'];
      }
      if (item === 'notes') {
        cell.innerHTML = row['notes'];
        cell.hidden = true;
      }
    }
    const editCell = rowElement.insertCell();
    editCell.innerHTML = `<input id="${row.id}" class="edit-checkbox" type="checkbox" name="selectCheckbox" value="selectCheckbox" />`;
    const deleteCell = rowElement.insertCell();
    deleteCell.innerHTML = `<input id="${row.id}" class="delete-checkbox" type="checkbox" name="deleteCheckbox" value="deleteCheckbox" />`;

    // row.forEach(item => {
    // if (headerText !== 'Name') {
    //   const cell = rowElement.insertCell();
    //   cell.innerHTML = row[headerText];
    // }
    // // if (headerText === 'Name') {
    //   const cell = rowElement.insertCell();
    //   const select = document.createElement('select');
    //   const label = document.createElement('label');
    //   label.setAttribute('for', `${row.State}`);
    //   select.innerHTML = `
    //         <option ${
    //           row.State === 'Name' ? 'selected' : ''
    //         } class='name' value='Name'>Name</option>
    //         <option ${
    //           row.State === 'Purchased From' ? 'selected' : ''
    //         } class='purchased-from' value='Purchased From'>Purchased From</option>
    //         <option ${
    //           row.State === 'Color' ? 'selected' : ''
    //         } class='color' value='Color'>Color</option>
    //         <option ${
    //           row.State === 'Tag Id' ? 'selected' : ''
    //         } class='tag-id' value='Tag Id'>Tag Id</option>
    //         <option ${
    //           row.State === 'Location Id' ? 'selected' : ''
    //         } class='location-id' value='Location Id'>Location Id</option>
    //         <option ${
    //           row.State === 'Notes' ? 'selected' : ''
    //         } class='notes' value='Notes'>Notes</option>
    //       `;
    //   select.value = row[headerText];
    //   select.onchange = () => {
    //     row[headerText] = select.value;
    //   };
    //   cell.appendChild(label);
    //   cell.appendChild(select);
    // }
  });
  dataTable.dispatchEvent(onContentEvent);

  const reloadButton = document.querySelector('#reloadButton');
  reloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    loadData();
  }); 

  const deleteButton = document.getElementById('deleteButton');
  deleteButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const checkedBoxes = [];
    const deletedCheckboxes = document.querySelectorAll(
      'input.delete-checkbox[type="checkbox"]:checked'
    );

    if (deletedCheckboxes.length === 0) {
      alert('No rows checked');
      return;
    };

    deletedCheckboxes.forEach(input => {
      checkedBoxes.push(input.id);
    });

    if (deletedCheckboxes.length === 0) {
      alert('No rows checked');
      return;
    }
    const confirmed = confirm('Are you sure you want to delete this data?');
    if (!confirmed) {
      return;
    }
    await deleteSelected(checkedBoxes);
    await render(data);
    
    reloadButton.click();
  });

  const editButton = document.getElementById('updateButton');
  editButton.addEventListener('click', async event => {
    let checked = null;
    const checkedBox = document.querySelectorAll('input.edit-checkbox[type="checkbox"]:checked');

    if (checkedBox.length === 0) {
      alert('No rows checked');
      return;
    };

    var script = document.createElement('script');
    script.src = '/js/updateIndex.js';
    document.body.appendChild(script);

    checkedBox.forEach(input => {
      checked = input.id;
    });
    if (checkedBox === null) {
      alert('No row checked');
      return;
    } else {
      localStorage.setItem('editColumnId', checked);
    }
    window.location.href = '/update';
  });
};

// Attach a click event listener to the table (event delegation)
let selectedCount = 0;
const maxChecks = 1;
table.addEventListener('click', event => {
  if (event.target.type === 'checkbox') {
    // Track the number of selected checkboxes
    selectedCount = event.target.checked ? selectedCount + 1 : selectedCount - 1;

    // Disable other edit checkboxes if the maximum allowed selections are reached
    const editCheckboxes = document.querySelectorAll('input.edit-checkbox[type="checkbox"]');
    editCheckboxes.forEach(input => {
      if (input !== event.target) {
        input.disabled = selectedCount >= maxChecks;
      }
    });
  }
});

document.addEventListener( 'click', ( event ) => {
  if ( event.target.localName === 'td' ) {
    const target = event.target.closest( 'tr' );
    const tbody = table.children.item(1);
    for ( child of tbody.children ) {
      if ( child === target ) {
        if ( selectedRow ) {
          selectedRow.classList.remove( 'selected' );
        }
        selectedRow = target;
        selectedRow.classList.add( 'selected' );
      }
    };
  }
  else {
    if ( selectedRow ) {
      selectedRow.classList.remove( 'selected' );
      selectedRow = null;
    }
  }
} );

window.onload = loadData();