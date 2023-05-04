(function () {
  let DB;

  document.addEventListener("DOMContentLoaded", () => {
    createDB();
    if (window.indexedDB.open("crm", 1)) {
      getClient();
    }

    listClients.addEventListener("click", deleteClient);
  });

  function deleteClient(e) {
    if (e.target.classList.contains("delete")) {
      const clientId = parseInt(e.target.dataset.client);
      const confirmDelete = confirm("Do you want to delete this client?");

      if (confirmDelete) {
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");
        objectStore.delete(clientId);

        transaction.oncomplete = function () {
        
          e.target.parentElement.parentElement.remove();
          printAlert("Client deleted successfully");
        };

        transaction.onerror = function () {
      
          printAlert("There is an error", "error");
        };
      }
    }
  }
  
  function createDB() {
    const createDB = window.indexedDB.open("crm", 1);
    createDB.onerror = function () {
      printAlert("There is an error");
    };
    createDB.onsuccess = function () {
      DB = createDB.result;
    };

    createDB.onupgradeneeded = function (e) {
      const db = e.target.result;

      const objectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("email", "email", { unique: false });
      objectStore.createIndex("telephone", "telephone", { unique: false });
      objectStore.createIndex("company", "company", { unique: false });
      objectStore.createIndex("id", "id", { unique: true });
    };
  }

  function getClient() {
    const openConnect = window.indexedDB.open("crm", 1);
    openConnect.onerror = function () {
      printAlert("There is an error");
    };
    openConnect.onsuccess = function () {
      DB = openConnect.result;
      const objectStore = DB.transaction("crm").objectStore("crm");
      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;

        if (cursor) {
       
          const { name, email, telephone, company, id } = cursor.value;
          const listClients = document.querySelector("#list-clients");

          listClients.innerHTML += `
       <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telephone}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${company}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="edit-client.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
              <a href="#" data-client="${id}" class="text-red-600 hover:text-red-900 delete">Delete</a>
          </td>
      </tr>
  `;
          cursor.continue();
        } else {
          printAlert(" There is not more records");
        }
      };
    };
  }
});
