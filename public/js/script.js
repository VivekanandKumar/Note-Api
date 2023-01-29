const notyf = new Notyf({
  position: { x: "right", y: "bottom" },
  duration: 2500,
});
skip = 0;
let isOperate = 0;
$(document).ready(function () {
  let noteId = "";
  $("#signup-btn").click(function () {
    const name = $.trim($("#name").val());
    const email = $.trim($("#email").val());
    const password = $.trim($("#pass").val());

    if (!name || !email || !password) {
      return notyf.error("All fields are required");
    }
    const data = { name, email, password };
    signup(data);
  });

  $("#login-btn").click(function () {
    const email = $.trim($("#email").val());
    const password = $.trim($("#pass").val());

    if (!email || !password) {
      return notyf.error("All fields are required");
    }
    const data = { email, password };
    login(data);
  });

  $(".notes").on("click", ".note", function () {
    noteId = $(this).attr("id");
    const title = $.trim($(this).children("header").text());
    const description = $.trim($(this).children("article").text());
    $(".modify-note input").val(title);
    $(".modify-note textarea").val(description);
    $(".modify-note").toggleClass("hidden");
  });
  $(".new-note").click(function () {
    $(".add-note").toggleClass("hidden");
  });
  $(".add-note .close").click(function () {
    $(".add-note").toggleClass("hidden");
  });
  $(".modify-note .close").click(function () {
    $(".modify-note").toggleClass("hidden");
  });

  $(".edit-btn").click(function () {
    const title = $.trim($(".modify-note .master input").val());
    const description = $.trim($(".modify-note .master textarea").val());
    if (!title || !description) {
      return notyf.error("All fields are required");
    }
    const data = { title, description };
    return editNote(noteId, data);
  });
  $(".delete-btn").click(function () {
    return deleteNote(noteId);
  });

  $(".add").click(function () {
    const title = $.trim($(".add-note input").val());
    const description = $.trim($(".add-note textarea").val());
    if (!title || !description) {
      return notyf.error("All fields are required");
    }
    const data = { title, description };
    newNote(data);
    $(".add-note input").val("");
    $(".add-note textarea").val("");
  });
});

function signup(data) {
  $.ajax({
    url: "/user/register",
    type: "POST",
    dataType: "json",
    data: data,
  })
    .then((response) => {
      if (response.redirect) {
        return window.open(response.redirect, "_self");
      }
      return notyf.error(response.message);
    })
    .catch((error) => {
      return console.log(error);
    });
}

function login(data) {
  $.ajax({
    url: "/user/login",
    type: "POST",
    dataType: "json",
    data: data,
  })
    .then((response) => {
      console.log(response.message);
      if (response.redirect) {
        return window.open(response.redirect, "_self");
      }
      return notyf.error(response.message);
    })
    .catch((error) => {
      console.log(error);
    });
}

function editNote(id, data) {
  isOperate = 1;
  skip = 0;
  $.ajax({
    type: "PATCH",
    url: `/${id}`,
    dataType: "json",
    data: data,
  })
    .then((response) => {
      display();
      $(".modify-note").toggleClass("hidden");
      return notyf.success(response.message);
    })
    .catch((error) => {
      return console.log(error);
    });
}

function deleteNote(id) {
  isOperate = 1;
  skip = 0;
  $.ajax({
    url: `/${id}`,
    type: "DELETE",
  })
    .then((response) => {
      // $(".notes").empty();
      display();
      $(".modify-note").toggleClass("hidden");
      return notyf.success(response.message);
    })
    .catch((error) => {
      return console.log(error);
    });
}

function newNote(data) {
  isOperate = 1;
  skip = 0;
  $.ajax({
    url: "/",
    type: "POST",
    dataType: "json",
    data,
  })
    .then((response) => {
      display();
      $(".add-note").toggleClass("hidden");
      return notyf.success(response.message);
    })
    .catch((error) => {
      return console.log(error);
    });
}
function display() {
  let objParams = {};
  objParams.skip = skip;
  objParams.fetch = fetchRecord;
  objParams.functionName = 'display';
  localStorage.setItem('objParamsList', JSON.stringify(objParams));
  $.ajax({
    url: `/notes`,
    type: "POST",
    data: objParams
  })
    .then((notes) => {
      let html = '';
      skip = skip + notes.length;
      notes.forEach((note) => {
        const date = moment(note.updatedOn).format("DD MMMM, YYYY");
        const time = moment(note.updatedOn).format("hh:mm A");
        html += `<div id=${note._id} class="note shadow-md rounded-md border p-3">
                      <header class="font-semibold text-xl mb-1">${note.title}</header>
                      <article class="text-sm py-2 overflow-hidden h-16">${note.description}</article>
                      <footer class="mt-4 flex justify-between items-center text-sm font-medium">
                        <div class="">${date}</div>
                        <div class="">${time}</div>
                      </footer>
                    </div>`
      });
      scrollCached = 0;
      if (isOperate) {
        isOperate = 0;
        return $(".notes").html(html);
      }
      $(".notes").append(html);
      isOperate = 0;
    })
    .catch((err) => {
      console.log(err);
    });
}
