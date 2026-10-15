'use client';

import { useState } from 'react';
import { studyData } from '@/data/studyData';
import type { AiResponse, Studymode } from '@/types/study';
import styles from './study.module.scss';

/*
openai 활용 시
프론트(html,react)에서 유저에게 data를 받습니다 ->
서버에게 전송(로컬)::내 서버에게 ->
로컬서버가 openai에게 data를 전송하고 응답을 받는다 ->
로컬서버가 프론트에게 받은 응답을 다시 전송해 준다
*/

const StudyPage = () => {
  const [mode, setMode] = useState<Studymode>('explain');
  const [message, setMessage] = useState(''); //사용자의 질문
  const [answer, setAnswer] = useState(''); //답변
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizAnswer,setQuizAnswer] = useState('')//ai가 만들어낸 퀴즈
  const [showAnswer,setShowAnswer] = useState(false)//ai가 만든 퀴즈의 답변이 있으면 보여주고 그렇지 않으면 감추는
  const [previousQuestions,setPreviousQuestions] = useState <string[]> ([])
  const [currentQuiz,setCurrentQuez] = useState('')

  const funque = async () => {
    if (!message.trim()) {
      setAnswer('질문을 입력해 주세요.');
      return;
    }

    if(mode === 'hint' && !currentQuiz){
      setAnswer('먼저 퀴즈를 출제해주세요')
      return
    }

    try {
      setLoading(true);
      setAnswer('');
      setError('');

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          mode,
          currentQuiz,
          previousQuestions,//이전 퀴즈도 전달하는 친구
        }),
      });

      if(!response.ok){
        throw new Error('ai 요청 실패')
      }

      const data : AiResponse = await response.json() 
    
      setAnswer(data.answer)

      if (mode === 'quiz') {
        setCurrentQuez(data.answer||'')
        setQuizAnswer(data.quesion||'')
        setShowAnswer(false)
        setPreviousQuestions((prev)=>[...prev,data.answer].slice(-10))
      }
    } catch(err) {
      console.log(err)
      setError('ai 답변을 가져오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.heading}>
        <p>AI React Learning</p>
        <h1>React 질문하기</h1>
        <span>원하는 학습 방식을 고르고 React에 대해 질문해 보세요.</span>
      </section>

      <section className={styles.methods} aria-labelledby="study-methods">
        <h2 id="study-methods">학습방법</h2>
        <div className={styles.cardList}>
        {studyData.map((item) => (
          <button
            className={`${styles.modeCard} ${
              mode === item.mode ? styles.selected : ''
            }`}
            key={item.id}
            type="button"
              aria-pressed={mode === item.mode}
            onClick={() => setMode(item.mode)}
          >
            <strong>{item.title}</strong>
              <p>{item.description}</p>
          </button>
        ))}
        </div>
      </section>

      <section className={styles.form}>
        <label htmlFor="message">질문</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="예시 : useState, useState퀴즈"
          rows={6}
        />
        <button type="button" onClick={funque} disabled={loading}>
          {loading ? '답변 생성 중' : '질문하기'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </section>

      {answer && (
        <section className={styles.answer}>
          <h2>AI 답변</h2>
          <p>{answer}</p>
          {
            mode === 'quiz' && quizAnswer && (
              <>
               <button onClick={()=>setShowAnswer(!showAnswer)}>
                  {showAnswer ? '정답숨기기' : '답변보기'}                 
               </button>
               {
                showAnswer && (
                   <p>{quizAnswer}</p>
                )
               }
              </>
            )
          }
        </section>
      )}
    </main>
  );
};

export default StudyPage;
