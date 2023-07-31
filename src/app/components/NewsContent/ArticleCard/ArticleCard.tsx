'use strict'

import { motion } from 'framer-motion';
import styles from './ArticleCard.module.scss'
import Image from 'next/image'

type ArticleCardProps = {
    title: string;
    content: string;
    date: string;
    image: string;
    url: string;
    source: string;
    topArticle: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, content, date, image, url, source, topArticle }) => {
    const dateString = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const nonUrlSource = source.replace('.com', '').replace('.co.uk', '')

    return (
        <div className={styles.cardWrapper}
        >
            {topArticle && (
                <div className={styles.topArticleCard}>
                    <p className={styles.topArticleText}>TOP OF THE DAY</p>
                </div>
            )}
            <div className={`${styles.card} ${topArticle ? styles.topArticle : ''}`}>
                <div className={styles.newsHeader}>
                    {title}
                </div>
                <div className={styles.date}>
                    {dateString} • {nonUrlSource}
                </div>
                <div className={styles.content}>
                    <p>{content}</p>
                </div>
                {image && (
                    <img src={image} alt={title} className={styles.image} />
                )}
            </div>
        </div>
    );
}

export default ArticleCard;