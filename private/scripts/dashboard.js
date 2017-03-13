$(document).on("click", ".js-logout", function (event) {
  event.preventDefault()
  $.get("/logout")
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

$.get("/user")
  .then(function (data) {
    $(".js-user").text(JSON.stringify(data))
    renderUsers()
  })
  .catch(function (error) {
    window.location = "/"
  })

function renderUsers () {
  $.get("/users")
    .then(function (users) {
      users.forEach((user) => {
        $(".js-userlist").append(`<li>${user.username}</li>`)
      })
    })
}
