$.ajaxSetup({xhrFields: { withCredentials: true } });

$(document).on("click", ".js-logout", function (event) {
  event.preventDefault()
  $.get("http://localhost:8080/logout")
    .then(function () {
      window.location = "/"
    })
    .catch(function (error) {
      if (error.responseJSON) {
        $(".js-error").text(error.responseJSON.message)
      } else {
        $(".js-error").text(error.responseText)
      }
    })
})

$.get("http://localhost:8080/user")
  .then(function (data) {
    $(".js-user").text(JSON.stringify(data))
    renderUsers()
  })
  .catch(function (error) {
    window.location = "/"
  })

function renderUsers () {
  $.get("http://localhost:8080/users")
    .then(function (users) {
      users.forEach((user) => {
        $(".js-userlist").append(`<li>${user.username}</li>`)
      })
    })
}
