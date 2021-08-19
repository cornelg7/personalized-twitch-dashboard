const HOST_NAME = 'https://api.twitch.tv/helix';
let ACCESS_TOKEN = '';

export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { data } = req.body;
      console.log('data', data);
      const channelData = await getTwitchStreamers();
      if (channelData) {
        res.status(200).json({ data: channelData })
      }
      res.status(404).send();
    }
  } catch (error) {
    console.warn(error.message);
    res.status(500).send();
  }
}

// Load access token
const loadTwitchAccessToken = async () => {
  console.log('In loadTwitchAccessToken -> Loading a new token');
  const path = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET_ID}&grant_type=client_credentials`;
  const response = await fetch(path, {
    method: 'POST'
  });
  const jsonResponse = await response.json();
  ACCESS_TOKEN = jsonResponse.access_token;
  if (!ACCESS_TOKEN) {
    throw response;
  }
}

// Send given request. If error 401 Unauthorized, load new token first
const sendRequestWithAuth = async (request) => {
  try {
    // Try sending the request
    const response = await request();
    // If unauthorized, throw error with code 401
    if (response.status === 401) {
      const error = new Error();
      error.code = 401;
      throw error;
    }
    // Otherwise return data from response
    const jsonResponse = await response.json();
    return jsonResponse.data;
  } catch (error) {
    // If request was unsuccessful, check if code is 401
    if (error?.code === 401) {
      console.log('In sendRequestWithAuth -> Not authorized');
      // First try to load another token
      try {
        await loadTwitchAccessToken();
      } catch (error2) {
        // If unsuccessful, log and throw error
        console.log('In sendRequestWithAuth -> Load new token', error2);
        throw error2;
      }
      // Then re-do the initial request
      try {
        const response = await request();
        const jsonResponse = await response.json();
        return jsonResponse.data;
      } catch (error3) {
        console.log('In sendRequestWithAuth -> Could not re-send request', error3);
        throw error3;
      } 
    }
    // Otherwise log and send the error 
    console.log('In sendRequestWithAuth -> Unknown error:', error);
    throw error;
  }
}

// Get twitch channels by channel name
const getTwitchChannels = async (channelName) => {
  // Parameter validation
  if (!channelName) {
    throw new Error('Invalid channel name');
  }

  // Create request
  const twitchChannelsRequest = async () => {
    // Make query request
    console.log('In getTwitchChannels -> Fetching data..');
    return await fetch(`${HOST_NAME}/search/channels?query=${channelName}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID
      }
    });
  }

  // Send request via the sendRequestWithAuth method
  return await sendRequestWithAuth(twitchChannelsRequest);
}

// Get (en) live twitch streamers
const getTwitchStreamers = async () => {
  // Create request
  const twitchStreamersRequest = async () => {
    // Make query request
    console.log('In getTwitchStreamers -> Fetching data..');
    return await fetch(`${HOST_NAME}/streams?first=100&language=en`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID
      }
    });
  }

  // Send request via the sendRequestWithAuth method
  return await sendRequestWithAuth(twitchStreamersRequest);
}