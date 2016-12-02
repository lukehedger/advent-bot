const isDevelopment = process.env.NODE_ENV === 'development'

const fetch = require('node-fetch')
const schedule = require('node-schedule')
const random = require('random-js')()

// config
const SCHEDULE = '0 0 14 * * *'
const SLACK_WEBHOOK_URL = 'https://api.slack.com/incoming-webhooks'
const SLACK_CHANNEL_DEV = '#testing'
const SLACK_CHANNEL_PROD = '#general'
const CONTESTANTS = [ 'luke' ]

// business time
const sendWinnerMessage = winner => fetch(SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channel: isDevelopment ? SLACK_CHANNEL_DEV : SLACK_CHANNEL_PROD,
    username: 'advent',
    icon_emoji: ':christmas_tree:',
    text: `Ho ho ho - ${winner} gets the chocolate today!`
  })
})

const getRandomWinner = () => {

  const winner = random.pick(CONTESTANTS)

  console.log(`😝  RANDOM : ${winner}`)

  return sendWinnerMessage(winner)

}

const scheduleRandomWinner = () => {

  console.log(`⏰  SCHEDULE : ${SCHEDULE}`)

  return schedule.scheduleJob( SCHEDULE, () => getRandomWinner() )

}

const init = (() => {

  console.log('🎄  A D V E N T  B O T')

  // START JOB -> dev mode ? run once : schedule
  return isDevelopment ? getRandomWinner() : scheduleRandomWinner()

})()
