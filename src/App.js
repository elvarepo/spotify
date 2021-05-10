import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useStateValue } from "./StateProvider";
import Player from "./components/Player";
import { getTokenFromResponse } from "./spotify";
import "./App.css";
import Login from "./components/Login";

const spotify = new SpotifyWebApi();

function App() {
  // inside {} is the date we want to get from useStateValue, dispatch mean we will update to useStateValue 
  const [{ token }, dispatch] = useStateValue();
  // const [token, setToken] = useState();

  useEffect(() => {
    // Set token
    const hash = getTokenFromResponse();
    // set hash = '' for security reason, after we get access_token, we want to clear it from browser 
    window.location.hash = "";
    let _token = hash.access_token;
    console.log('I have a token >>> ', token)

    if (_token) {
      // setToken(_token);
      // below is how we actually connect spotify with our app, use the seAccessToken(token)
      spotify.setAccessToken(_token);

      // spotify.getMe().then(user => {
      //   console.log("USER >>> ", user)
      // })
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      spotify.getPlaylist("37i9dQZEVXcJZyENOWUFo7").then((response) =>
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
      );

      spotify.getMyTopArtists().then((response) =>
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: response,
        })
      );

      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify,
      });

      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user,
        });
      });

      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists,
        });
      });
    }
  }, [token, dispatch]);

  return (
    <div className="app">
      {!token && <Login />}
      {token && <Player spotify={spotify} />}
    </div>
  );
}

export default App;