import Image from 'next/image'
import styles from './styles/page.module.scss'
import Header from './components/Header/Header'
import NewsContent from './components/NewsContent/NewsContent'

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <Header />
      <section className={styles.contentSection}>
        <div className={styles.contentText}>
          Your Daily Brief: Stay <span className={styles.gradient1}>Informed</span>. Stay <span className={styles.gradient2}>Empowered</span>.
        </div>
        <NewsContent />
      </section>
    </main>
  )
}
