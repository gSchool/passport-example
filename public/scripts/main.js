$.ajaxSetup({xhrFields: { withCredentials: true } });

$(document).on("submit", ".js-loginform", function (event) {
  event.preventDefault()
  $.post("http://localhost:8080/login", $(this).serialize())
    .then((data) => {
      window.location = "/dashboard.html"
    })
    .catch((error) => {
      if (error.responseJSON) {
        $(".js-error").text(error.responseJSON.message)
      } else {
        $(".js-error").text(error.responseText)
      }
    })
    .then((data) => {
      $(this)[0].reset()
    })
})

$(document).on("submit", ".js-registerform", function (event) {
  event.preventDefault()
  $.post("http://localhost:8080/register", $(this).serialize())
    .then((data) => {
      $(".js-error").text("User created")
      $(this)[0].reset()
    })
    .catch((error) => {
      if (error.responseJSON) {
        $(".js-error").text(error.responseJSON.message)
      } else {
        $(".js-error").text(error.responseText)
      }
    })
    .then((data) => {
      $(this)[0].reset()
    })
})
