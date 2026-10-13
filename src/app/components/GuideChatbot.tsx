'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './GuideChatbot.module.scss';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
};

type GuideResponse = {
  answer?: string;
  error?: string;
};

const suggestions = [
  'AI 퀴즈는 어디서 하나요?',
  '힌트는 어떻게 보나요?',
  '날씨는 어디서 확인하나요?',
];

const GuideChatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '안녕하세요! React 학습, AI 퀴즈, 힌트, 날씨 등 홈페이지 이용 방법을 안내해 드려요.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const messageRef = useRef<HTMLDivElement | null>(null);
  const sendingRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [message, loading, open]);

  const closeChat = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const handleSend = async (suggestion?: string) => {
    const content = (suggestion ?? question).trim();
    if (!content || sendingRef.current) return;

    sendingRef.current = true;
    setMessage((prev) => [...prev, { role: 'user', content }]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content }),
      });
      const data = (await response.json()) as GuideResponse;

      if (!response.ok) {
        throw new Error(data.error || '답변을 불러오지 못했습니다. 다시 시도해 주세요.');
      }

      const answer = data.answer;
      if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error('답변을 생성하지 못했습니다. 다시 질문해 주세요.');
      }

      setMessage((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessage((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: err instanceof Error ? err.message : '연결 중 오류가 발생했습니다. 다시 시도해 주세요.',
          error: true,
        },
      ]);
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <aside
      className={styles.chatbot}
      aria-label="홈페이지 가이드 챗봇"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) closeChat();
      }}
    >
      {open && (
        <section
          id="guide-chat-panel"
          className={styles.panel}
          role="dialog"
          aria-labelledby="guide-chat-title"
        >
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>REACT AI STUDY</p>
              <h2 id="guide-chat-title">홈페이지 가이드</h2>
              <p className={styles.subtitle}>궁금한 기능을 편하게 물어보세요.</p>
            </div>
            <button type="button" className={styles.closeButton} onClick={closeChat} aria-label="가이드 챗봇 닫기">
              ×
            </button>
          </header>

          <div className={styles.messages} ref={messageRef} role="log" aria-label="대화 내용" aria-live="polite">
            {message.map((item, index) => (
              <div key={index} className={`${styles.message} ${item.role === 'user' ? styles.userMessage : styles.answer}`}>
                <span className={styles.sender}>{item.role === 'user' ? '나' : '가이드'}</span>
                <p className={`${styles.bubble} ${item.error ? styles.error : ''}`}>{item.content}</p>
              </div>
            ))}

            {message.length === 1 && (
              <div className={styles.suggestions}>
                <p>자주 찾는 질문</p>
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => void handleSend(suggestion)}>
                    {suggestion}<span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className={styles.loading} role="status">
                <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
                답변을 준비하고 있어요
              </div>
            )}
          </div>

          <form className={styles.form} onSubmit={(event) => {
            event.preventDefault();
            void handleSend();
          }}>
            <label htmlFor="guide-question" className={styles.srOnly}>홈페이지 이용 질문</label>
            <div className={styles.inputRow}>
              <input
                id="guide-question"
                type="text"
                placeholder="궁금한 내용을 입력해 주세요"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault();
                }}
                disabled={loading}
                autoComplete="off"
              />
              <button type="submit" disabled={loading || !question.trim()}>
                {loading ? '대기' : '전송'}
              </button>
            </div>
            <p className={styles.helper}>React 학습부터 날씨 확인까지, 이용 방법을 안내해요.</p>
          </form>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="guide-chat-panel"
        aria-label={open ? '가이드 챗봇 닫기' : '가이드 챗봇 열기'}
      >
        {open ? <span aria-hidden="true">×</span> : (
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 18.5 3 21v-5.5A8 8 0 0 1 2 12a9 9 0 1 1 9 9 9 9 0 0 1-6-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M7 10h8M7 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </aside>
  );
};

export default GuideChatbot;