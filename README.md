# TappyTanks

.env.{ENV} is needed to commit files, if API_PORT is not

## deploy to Heroku
1. `npm run start:build`
2. add and commit whole `/dist` folder.
**P.S.** heroku will crash if we do building on the heroku dyno
3. `git push heroku master`
