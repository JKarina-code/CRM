(function () {
  let DB;
  let idClient;
  const formEdit = document.querySelector("#formEditClient");

  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const companyInput = document.querySelector("#company");
  const telephoneInput = document.querySelector("#telephone");

  document.addEventListener("DOMContentLoaded", () => {
    connectDB();

    formEdit.addEventListener("submit", updateClient);

    const parameterURL = new URLSearchParams(window.location.search);
    idClient = parameterURL.get("id");

    if (idClient) {
      setTimeout(() => {
        getClient(idClient);
      }, 100);
    }

    function connectDB() {
      const openConnect = window.indexedDB.open("crm", 1);
      openConnect.onerror = function () {
        printAlert("There is an error");
      };
      openConnect.onsuccess = function () {
        DB = openConnect.result;
      };
    }

    function fillForm(dataClient) {
      const { name, email, company, telephone } = dataClient;
      nameInput.value = name;
      emailInput.value = email;
      telephoneInput.value = company;
      companyInput.value = telephone;
    }

    function updateClient(e) {
      e.preventDefault();

      if (
        nameInput === "" ||
        emailInput === "" ||
        companyInput === "" ||
        telephoneInput === ""
      ) {
        printAlert(" All fields are required", "error");
        return;
      }

      // update...
      const clientUpdated = {
        name: nameInput.value,
        email: emailInput.value,
        company: companyInput.value,
        telephone: telephoneInput.value,
        id: Number(idClient),
      };

      // update...
      const transaction = DB.transaction(["crm"], "readwrite");
      const objectStore = transaction.objectStore("crm");

      objectStore.put(clientUpdated);

      transaction.oncomplete = function () {
        printAlert("Client edited successfully");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 3000);
      };

      transaction.onerror = function () {
        printAlert("There is an error", "error");
      };
    }

    function getClient(id) {
      const transaction = DB.transaction(["crm", "readwrite"]);
      const objectStore = transaction.objectStore("crm");
      var request = objectStore.openCursor();
      request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          if (cursor.value.id == Number(id)) {
            fillForm(cursor.value);
          }
          cursor.continue();
        }
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
  });
});
