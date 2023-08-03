'use client';

import Image from 'next/image'
import styles from './styles/page.module.scss'
import Header from './components/Header/Header'
import NewsContent from './components/NewsContent/NewsContent'
import { motion } from "framer-motion";
import { getAuthTokenFromCookie } from './utils/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from './api/external-api';

export default function Home() {






  const textVariants = {

    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.contentSection}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className={styles.contentText}
        >
          Daily Brief: Stay <motion.span className={styles.gradient1} variants={textVariants}>Informed</motion.span>. Stay <motion.span className={styles.gradient2} variants={textVariants}>Empowered</motion.span>.
        </motion.div>
        <NewsContent />
      </section>
    </main >
  )
}
