const axios = require('axios')

module.exports = {
  verifyCaptcha: function (req, res, cb) {
    if (!req.body['g-recaptcha-response']) {
      return res.status(400).send("No captcha")
    }

    const URL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress

    axios.get(URL).then(function (response) {
      if (response.data.success !== undefined && !response.data.success) {
        return res.status(429).send("Invalid captcha")
      }

      cb()
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}