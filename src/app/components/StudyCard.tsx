import type { StudyItem } from "@/types/study";
import styles from "./StudyCard.module.scss";

type Pro = {
  item: StudyItem;
};

const StudyCard = ({ item }: Pro) => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span>{item.id}</span>
        <h3>{item.title}</h3>
      </div>
      <p>{item.description}</p>
      <span className={styles.badge}>{item.mode}</span>
    </article>
  );
};

export default StudyCard;
