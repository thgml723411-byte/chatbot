import type { WeatherData } from '@/types/weather';

type OpenWeatherError = {
  message?: string;
};

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city?.trim()) {
      return Response.json(
        { message: '도시를 입력해주세요.' },
        { status: 400 },
      );
    }

    if (!apiKey) {
      return Response.json(
        { message: '날씨 API 키가 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city,
      )}&appid=${apiKey}&units=metric&lang=kr`,
    );

    if (!res.ok) {
      const errorData = (await res.json()) as OpenWeatherError;

      return Response.json(
        { message: errorData.message ?? '날씨 정보를 받지 못했습니다.' },
        { status: res.status },
      );
    }

    const data = (await res.json()) as WeatherData;

    return Response.json(data);
  } catch {
    return Response.json(
      { message: '날씨 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
};
