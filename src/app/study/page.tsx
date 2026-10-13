'use client';

import { useState } from 'react';
import { studyData } from '@/data/studyData';
import type { AiResponse, Studymode } from '@/types/study';
import styles from './study.module.scss';

const StudyPage = () => {
  const [mode, setMode] = useState<Studymode>('explain');
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const funque = async () => {
    if (!message.trim()) {
      setError('질문을 입력해 주세요.');
      return;
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
        }),
      });

      const data = (await response.json()) as Partial<AiResponse> & {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? 'AI 답변을 불러오지 못했습니다.');
        return;
      }

      setAnswer(data.answer ?? '');
    } catch {
      setError('요청 중 오류가 발생했습니다.');
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

      <section className={styles.cardList} aria-label="학습 방식 선택">
        {studyData.map((item) => (
          <button
            className={`${styles.modeCard} ${
              mode === item.mode ? styles.selected : ''
            }`}
            key={item.id}
            type="button"
            onClick={() => setMode(item.mode)}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </section>

      <section className={styles.form}>
        <label htmlFor="message">질문</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="예시: useState를 쉽게 설명해줘"
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
        </section>
      )}
    </main>
  );
};

export default StudyPage;
