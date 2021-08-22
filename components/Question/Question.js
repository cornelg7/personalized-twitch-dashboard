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
  IMAGES_WIDTH,
  IMAGES_HEIGHT,
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
    setAnswered(true);
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
      <div className={`${styles.questionHeader} ${styles.card}`}>
        <span className={styles.questionTitle}>
          { pageState.data?.questionNumber ?? null } / {NUMBER_OF_QUESTIONS}
        </span>
        <span className={styles.questionScore}>
          ⭐ {pageState.data?.score}
          {answered && (
            <span className={styles.questionThisRoundScore}>
              <span className={styles.questionThisRoundScorePlus}>+</span>
              <span className={styles.questionThisRoundScoreValue}>{score}</span>
            </span>
          )}
        </span>
        <span className={styles.questionCounter}>
          🕓 {runningCounter ? counter : COUNTER_TIME}
        </span>
      </div>
      <div className={`${styles.card} ${styles.questionDetailsStreamerName}`}>
        <span className={styles.questionDetailsStreamerNameInner}>
          Name: <span className={styles.streamerName}>{ pageState.data?.question?.correctAnswerData?.user_name }</span>
        </span>
      </div>
      <div className={`${styles.card} ${styles.questionDetailsStreamName} ${counter > 16 && !answered ? styles.streamNameHidden : null}`}>
        <span className={styles.questionDetailsStreamNameInner}>
          <span className={styles.streamNameHeading}>Title: </span>
          <span className={styles.streamName}>
            { pageState.data?.question?.correctAnswerData?.title }
          </span>
        </span>
      </div>
      <div className={styles.questionDetailsStreamImage}>
        {(counter > 10 && !answered) && (
          <div className={styles.questionDetailsStreamImageBlur}></div>
        )}
        <Image 
          loading="lazy" 
          priority={false} 
          width={IMAGES_WIDTH} 
          height={IMAGES_HEIGHT} 
          placeholder="blur" 
          src={pageState.data?.question?.correctAnswerData?.thumbnail_url}
          styles={{'border-radius': '10px'}}
        ></Image>
      </div>
      <div className={styles.questionAnswerContainer}>
        { 
          pageState.data?.question?.allAnswersData?.map((answer) => 
            <div 
              key={`answer-${answer.game_id}`} 
              className={`
                ${styles.questionAnswer}
                ${styles.card}
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
            </div>
          )
        }
      </div>
      <div className={styles.nextQuestionButtonContainer}>
        {answered && !loading && (
          <button onClick={ () => onNextQuestion() }>
            Next question
          </button>
        )}
        {loading && (<Loading/>)}
        </div>
    </div>
  )
}

export default Question;