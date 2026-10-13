import Link from "next/link";
import { studyData } from "@/data/studyData";
import StudyCard from "./components/StudyCard";
import styles from "./page.module.scss";

const Home = () => {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p>NEXT PROJECT</p>
        <h1>
          NEXT 기반
          <br />
          AI 활용 React.js 학습
        </h1>
        <p>OpenAI를 활용하여 React.js 학습을 서비스합니다.</p>
      </section>

      <section className={styles.section}>
        <h2>AI 학습 구성</h2>
        <div className={styles.cardList}>
          {studyData.map((item) => (
            <StudyCard key={item.id} item={item} />
          ))}
        </div>
        <Link className={styles.linkButton} href="/study">
          학습 바로가기
        </Link>
      </section>

      <section className={styles.section}>
        <div className={styles.infoBox}>
          <p>OpenWeather API</p>
          <h2>지역별 날씨 확인</h2>
        </div>
        <Link className={styles.linkButton} href="/weather">
          날씨 확인 바로가기
        </Link>
      </section>
    </main>
  );
};

export default Home;
