import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/Question.module.scss';
import Loading from '../Loading';

const Question = ({ 
  pageState,
  setPageState,
  NUMBER_OF_QUESTIONS,
  COUNTER_TIME,
  COUNTER_DELAY,
  counter,
  setCounter,
  runningCounter,
  setRunningCounter
}) => {

  // States
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hooks
  useEffect(() => {
    if (counter === 0) {
      onAnswer({game_id: 'definitelyawronganswer'});
    }
  }, [counter]);

  // Actions
  const onAnswer = (answer) => {
    if (answered) {
      return;
    }
    setLoading(true);
    setRunningCounter(false);
    if (answer.game_id === pageState.data?.question?.correctAnswerData?.game_id) {
      setScore(getScoreFromTime(counter));
    } else {
      setScore(0);
    }
    setTimeout(() => {
      setAnswered(true);
      setLoading(false);
    }, COUNTER_DELAY + 100);
  }

  const onNextQuestion = () => {
    setAnswered(false);
    setRunningCounter(false);
    setCounter(15);
    if (pageState.data?.questionNumber < NUMBER_OF_QUESTIONS) {
      setPageState({
        state: 'Questions', 
        data: {
          questionNumber: (pageState.data?.questionNumber ?? 0) + 1,
          questions: pageState.data?.questions,
          question: pageState.data?.questions[(pageState.data?.questionNumber ?? 0)],
          score: pageState.data?.score + score
        }
      });
      return;
    }
    setPageState({
      state: 'Leaderboard',
      data: { 
        score: pageState.data?.score + score
      }
    });
  }

  // Utils
  const getScoreFromTime = (time) => {
    if (time > 16) {
      return 10;
    }
    if (time > 9) {
      return 8;
    }
    return Math.min(time, 7);
  }

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionHeader}>
        <span className={styles.questionTitle}>
          Question { pageState.data?.questionNumber ?? null } / {NUMBER_OF_QUESTIONS}
        </span>
        <span className={styles.questionScore}>
          {pageState.data?.score}
          {answered && (
            <span className={styles.questionThisRoundScore}>
              <span className={styles.questionThisRoundScorePlus}>+</span>
              <span className={styles.questionThisRoundScoreValue}>{score}</span>
            </span>
          )}
        </span>
        <span className={styles.questionCounter}>
          {runningCounter ? counter : COUNTER_TIME}
        </span>
      </div>
      <div className={styles.questionDetailsContainer}>
        <div className={styles.questionDetailsStreamerName}>
          Streamer <span className={styles.streamerName}>{ pageState.data?.question?.correctAnswerData?.user_name }</span> is streaming right now!
        </div>
        {(counter <= 16 || answered) && (
          <div className={styles.questionDetailsStreamName}>
            The stream is titled: <span className={styles.streamName}>{ pageState.data?.question?.correctAnswerData?.title }</span>.
          </div>
        )}
        {(counter <= 9 || answered) && (
          <div className={styles.questionDetailsStreamImage}>
            <Image loading="eager" priority={true} width={356} height={200} src={pageState.data?.question?.correctAnswerData?.thumbnail_url}></Image>
          </div>
        )}
      </div>
      <div className={styles.questionStaticQuestion}>
        What game are they streaming?
      </div>
      <div className={styles.questionAnswerContainer}>
        { 
          pageState.data?.question?.allAnswersData?.map((answer) => 
            <div 
              key={`answer-${answer.game_id}`} 
              className={`
                ${styles.questionAnswer}
                ${answered 
                  ? styles.disabled 
                  : null}
                ${answered
                  ? (answer.game_id === pageState.data?.question?.correctAnswerData?.game_id 
                    ? styles.correctAnswer 
                    : styles.wrongAnswer) 
                  : null}`
                }
              onClick={() => onAnswer(answer)}
            >
              <div className={styles.questionAnswerTitle}>
                {answer.game_name}
              </div>
              {/* <div className={styles.questionAnswerImageContainer}>
                <Image className={styles.questionAnswerImage} src={answer.}></Image>
              </div> */}
            </div>
          )
        }
      </div>
      {answered && (
        <button onClick={ () => onNextQuestion() }>
          Next question
        </button>
      )}
      {loading && (<Loading/>)}
    </div>
  )
}

export default Question;