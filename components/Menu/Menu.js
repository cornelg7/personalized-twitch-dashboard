import React from 'react';
import Loading from '../Loading';
import styles from '../../styles/Menu.module.css';

const Menu = ({ pageState, setPageState }) => {
  const onPlay = () => {
    setPageState({
      state: 'Questions', 
      data: {
        questionNumber: 1, 
        questions: pageState.data?.questions,
        question: pageState.data?.questions[0],
        score: 0
      }
    })
  }

  return (
    <div>
      <p>Menu...</p>

      {!!pageState.data?.loading ? <Loading/> : null}
      <button
        disabled={!!pageState.data?.loading}
        onClick={() => onPlay()}>
        Play!
      </button>
    </div>
  )
}

export default Menu;