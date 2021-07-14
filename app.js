const { App } = require('@slack/bolt');
// Enables fetching of a url with specified parameters
let fetch = require('node-fetch');
// Requires to add basic authentication to headers
let base64 = require('base-64');
let createClient = require('pexels');


// Initializes your app with your bot token and signing secret
const app = new App({
  // Currently these tokens get stored as command line environment variables
  // I believe I need to create a .env file and store the variables there but not quite sure. 
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me for a Cat"
                    },
                    "action_id": "button_click"
                }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
});

// Pre: Action triggered when the "Click Me for a Cat" button is pressed
// Post: Pulls a cat image from the specified URL and display it in the current Slack channel
app.action('button_click', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();

    // Below my attempt at an HTTP request with autentication (Does not work)
    // There is similar code in the 'blocks' section below. Not sure where it should go for best practice.

    /*await say(`<@${body.user.id}> clicked the button`);
    headers = { 'Authorization': process.env.API_KEY };
    response = requests.get("https://api.pexels.com/v1/search?query=cats&per_page=1", headers = headers);
    fetch('https://api.pexels.com/v1/search?query=cats&per_page=1', {
        headers = { 'Authorization': process.env.API_KEY }
    });*/
    const client = createClient('563492ad6f9170000100000142c7037c684e4abe8ba18d8eecacfd5c');
    const query = 'Cats';
    let photo = client.photos.search({ query, per_page: 1 }).then(photos => {temp});
    await say({
        blocks: [
            {
                "type": "divider"
            },
            {
                "type": "image",
                // This link does not always work to pull images from lorempixel
                //"image_url": "https://lorempixel.com/400/400/cats/" + Math.floor((Math.random() * 10) + 1),

                // Below is a temporary test link to a single photo
                "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
                "alt_text": "cat photo"

                // ----> This is what the end goal should be using <----
                //"type": "image",
                //"image_url": "https://api.pexels.com/v1/search?query=cats&per_page=1",
                //"headers": {'Authorization': process.env.API_KEY},
                //"alt_text": "Cat Photo",
            }
        ]
    });
});

(async () => {
  // Starts the app on the specified port
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();