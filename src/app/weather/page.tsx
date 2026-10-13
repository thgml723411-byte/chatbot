'use client';

import { useState } from 'react';
import type { WeatherData } from '@/types/weather';
import styles from './weather.module.scss';

const WeatherPage = () => {
  const [city, setCity] = useState('Seoul');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  const funWeather = async () => {
    if (!city.trim()) {
      setError('도시를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setWeather(null);

      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? '날씨 요청에 실패했습니다.');
      }

      const data = (await res.json()) as WeatherData;
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '날씨 정보를 가져오지 못했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className={styles.title}>
        <p>OPEN WEATHER API</p>
        <h2>현재 날씨</h2>
        <span>
          도시 이름을 입력하면 현재 날씨를 확인할 수 있습니다.
        </span>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Seoul"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <button type="button" onClick={funWeather} disabled={loading}>
          {loading ? '검색 중...' : '날씨 검색'}
        </button>
      </div>

      {error && <div>{error}</div>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp}°C</p>
          <p>{weather.wind.speed}m/s</p>
        </div>
      )}
    </main>
  );
};

export default WeatherPage;
