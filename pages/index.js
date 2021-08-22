// Main entry point of your app
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import React, { useEffect, useState } from 'react';
import BackgroundBubbles from '../components/BackgroundBubbles';
import Leaderboard from '../components/Leaderboard';
import Question from '../components/Question';
import Menu from '../components/Menu';
import * as _ from 'lodash';

const Home = () => {
  // Constants
  const NUMBER_OF_QUESTIONS = 5;
  const COUNTER_DELAY = 1000;
  const COUNTER_TIME = 20;
  const IMAGES_WIDTH = 300;
  const IMAGES_HEIGHT = 168;
  // State
  const [pageState, setPageState] = useState({state: 'Menu', data: { loading: true }});
  const [counter, setCounter] = useState(COUNTER_TIME);
  const [runningCounter, setRunningCounter] = useState(false);

  // Utils
  const shuffle = (inputArray) => {
    // Fisher-Yates shuffle
    let array = _.cloneDeep(inputArray);
    let m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  const get3RandomNumbers = (n) => {
    const r1 = _.random(0, n);
    let r2, r3;
    do {
      r2 = _.random(0, n);
    } while (r2 === r1);
    do {
      r3 = _.random(0, n);
    } while (r3 === r2 || r3 === r1);
    return [r1, r2, r3];
  }

  const getQuestion = (i, data, games) => {
    const randoms = get3RandomNumbers(games.length - 1);
    // console.log('randoms', randoms);
    const randomData = {};
    randoms.forEach(random => { randomData[games[random]] = data[games[random]][0]; });
    // console.log('randomData', randomData);
    const correctAnswerGameDataIndex = _.random(0, 2);
    const correctAnswerGameData = randomData[Object.keys(randomData)[correctAnswerGameDataIndex]];
    const correctAnswerGameDataSelect = {
      game_id: correctAnswerGameData.game_id,
      game_name: correctAnswerGameData.game_name,
      id: correctAnswerGameData.id,
      thumbnail_url: correctAnswerGameData.thumbnail_url.replace('{width}', IMAGES_WIDTH).replace('{height}', IMAGES_HEIGHT),
      title: correctAnswerGameData.title,
      user_id: correctAnswerGameData.user_id,
      user_name: correctAnswerGameData.user_name,
      viewer_count: correctAnswerGameData.viewer_count,
    }
    // console.log('correctAnswerGameDataSelect', correctAnswerGameDataIndex, correctAnswerGameDataSelect);
    const allAnswerGameData = [];
    Object.keys(randomData).forEach((game, index) => { 
      allAnswerGameData.push({
        game_id: randomData[game].game_id,
        game_name: randomData[game].game_name,
        correctAnswer: index === correctAnswerGameDataIndex
      });
    });
    // console.log('allAnswerGameData', allAnswerGameData);
    return {
      questionNumber: i,
      correctAnswerData: correctAnswerGameDataSelect,
      allAnswersData: allAnswerGameData
    }
  }
  
  // Hooks
  useEffect(() => {
  }, []);

  useEffect(() => {
    // console.log('State changed', pageState);
    if (pageState.state === 'Menu' && pageState.data?.loading === true) {
      // todo uncomment this
      loadStreamersData();
      
      // todo delete this
      // setPageState({ state: 'Leaderboard', data: {
      //   score: 23
      // }});
      return;
    }
    if (pageState.state === 'Questions') {
      setCounter(COUNTER_TIME);
      setRunningCounter(true);
    }
  }, [pageState]);

  useEffect(() => {
    if (runningCounter && counter > 0) {
      setTimeout(() => {
        if (runningCounter && counter > 0) {
          setCounter(counter - 1);
        }
      }, COUNTER_DELAY);
    }
  }, [counter, runningCounter]);

  // Actions
  const processStreamersResponse = (streamersData) => {
    // console.log('in processStreamersResponse: ', streamersData);
    let dataByGame = _.groupBy(streamersData, 'game_name');
    let games = shuffle(Object.keys(dataByGame));
    games.forEach(game => {
      dataByGame[game] = shuffle(dataByGame[game]);
    });
    if (games.length > 30) {
      games = _.slice(games, 0, 30);
    }
    const data = {};
    games.forEach(game => { data[game] = dataByGame[game]; });
    // console.log('games', games, games.length);
    // console.log('dataByGame', dataByGame);
    // console.log('data', data);
    const questions = [];
    [...Array(NUMBER_OF_QUESTIONS).keys()].forEach(i => {
      questions.push(getQuestion(i+1, data, games));
    });
    // console.log('questions', questions);
    return questions;
  }

  const loadStreamersData = async () => {
    const streamersResponse = await fetch(`${window.location.origin}/api/twitch`,  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'streamers' })
    });
    const jsonStreamersResponse = await streamersResponse.json();
    const questions = processStreamersResponse(jsonStreamersResponse.data);
    setPageState({ state: 'Menu', data: { loading: false, questions } });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Twitch guess</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <div className={styles.mainContainer}>
        <BackgroundBubbles></BackgroundBubbles>
        {
          pageState?.state === 'Menu' ? 
            <Menu pageState={pageState} setPageState={setPageState}/>
          : pageState?.state === 'Questions' ? 
            <Question 
              pageState={pageState} 
              setPageState={setPageState} 
              NUMBER_OF_QUESTIONS={NUMBER_OF_QUESTIONS}
              COUNTER_TIME={COUNTER_TIME}
              COUNTER_DELAY={COUNTER_DELAY}
              IMAGES_WIDTH={IMAGES_WIDTH}
              IMAGES_HEIGHT={IMAGES_HEIGHT}
              counter={counter}
              setCounter={setCounter}
              runningCounter={runningCounter}
              setRunningCounter={setRunningCounter}
            />
          : pageState?.state === 'Leaderboard' ? 
            <Leaderboard pageState={pageState} setPageState={setPageState}/>
          : (<div> Uh-oh, you broke it! </div>)
        }
      </div>
    </div>
  )
}

export default Home 