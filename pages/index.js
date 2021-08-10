// Main entry point of your app
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useState } from 'react';

const Home = () => {
  // State
  const [channels, setChannels] = useState([]);

  // Actions
  const addChannel = event => {
    event.preventDefault();
    const { value } = event.target.elements.name;
    if (value) {
      const path = `${window.location.origin}`;
      const request_data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: value })
      }
      
      fetch(`${path}/api/twitch`, request_data).then((response) => {
        return response.json();
      }).then(response => {
        console.log('From server: ', response.data);
        setChannels(prevState => [...prevState, value]);
      });
    }
    event.target.elements.name.value = '';
  };

  // Render methods
  const renderForm = () => (
    <div className={styles.formContainer}>
      <form onSubmit={addChannel}>
        <input id="name" placeholder="Twitch Channel name" type="text" required></input>
        <button type="submit">Add Channel</button>
      </form>
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>🎥 Personal Twitch Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.inputContainer}>
        {renderForm()}
        <div>{channels.join(', ')}</div>
      </div>
    </div>
  )
}

export default Home