const express = require('express')
const app = express()
const fs = require('fs')
const nunjucks = require('nunjucks')
const Routes = require('./routes.json')

app.use('/assets', express.static(__dirname + '/www'));

nunjucks.configure('src', {
  autoescape: true,
  express: app
});

app.get("*", (req, res) => {
  const getRoute = Routes.find(route => route.url === req.originalUrl)
  if (!getRoute) {
    if (fs.existsSync(`${__dirname}/src/404.html`)) {
      return res.status(404).render('404.html')
    } else {
      return res.status(404).send('Page not found!')
    }
  }
  if (fs.existsSync(`${__dirname}/src/${getRoute.template}`)) {
    return res.render(getRoute.template);
  }
})

app.listen(3000)
