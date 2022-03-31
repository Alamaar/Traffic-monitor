const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const routerUser = require('./routes/users')
const users = require('./routes/users');

const routerTraficData = require('./routes/traffic_data')


app.use(bodyParser.json());
app.use('/users', routerUser);
app.use('/traffic_data', routerTraficData)

app.set('port', (process.env.PORT || 3000));



app.get('/', (req, res) => {
  res.send('Hello World!')
})





module.exports = {
    start : function(){
      serverInstance = app.listen(app.get('port'), () => {
        console.log(`Example app listening on port ${app.get('port')}`)
      })
    },
    close : function(){
  
      serverInstance.close()
  
    }
  }
  