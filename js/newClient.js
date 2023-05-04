(function () {
  let DB;
  const formNewClient = document.querySelector("#formNewClient");

  document.addEventListener("DOMContentLoaded", () => {
    formNewClient.addEventListener("submit", validateClient);
    connectingDB();
  });

  function connectingDB() {
    const openConnection = window.indexedDB.open("crm", 1);
    openConnection.onerror = function () {
      printAlert("There is an error");
    };
    openConnection.onsuccess = function () {
      DB = openConnection.result;
    };
  }

  function validateClient(e) {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const telephone = document.querySelector("#telephone").value;
    const company = document.querySelector("#company").value;

    if (name === "" || email === "" || telephone === "" || company === "") {
      printAlert(" All fields are required", "error");
      return;
    }

    const client = {
      name,
      email,
      telephone,
      company,
    };
    client.id = Date.now();
    createNewClient(client);
  }

  function createNewClient(client) {
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    objectStore.add(client);

    transaction.oncomplete = function () {
      printAlert("Client added successfully");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };

    transaction.onerror = function () {
      printAlert("There is an error", "error");
    };
  }

  function printAlert(message, type) {
    const divNew = document.createElement("div");
    const alert = document.querySelector(".alert");

    if (!alert) {
      divNew.classList.add(
        "px-4",
        "py-3",
        "rounded",
        "max-w-lg",
        "mx-auto",
        "mt-6",
        "text-center",
        "border",
        "alert"
      );

      if (type === "error") {
        divNew.classList.add("bg-red-100", "border-red-400", "text-red-700");
      } else {
        divNew.classList.add(
          "bg-green-100",
          "border-green-400",
          "text-green-700"
        );
      }

      divNew.textContent = message;
      document
        .querySelector(".contentNew")
        .insertBefore(divNew, document.querySelector(".contentForm"));

      setTimeout(() => {
        divNew.remove();
      }, 3000);
    }
  }
})();
