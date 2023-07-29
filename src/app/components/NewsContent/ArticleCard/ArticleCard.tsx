'use strict'

import styles from './ArticleCard.module.scss'
import Image from 'next/image'

interface ArticleCardProps {
    title: string;
    content: string;
    date: string;
    image: string | null;
    url: string;
    source: string
    topArticle: boolean;
}

export default function ArticleCard({ title, content, date, image, url, source, topArticle }: ArticleCardProps) {

    // Render date string in format: "July 27th, 2023" format from 2023-07-26T17:19:52+00:00
    const dateString = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    //Remove tld from source
    const nonUrlSource = source.replace('.com', '').replace('.co.uk', '')
    return (
        <a className={styles.cardWrapper} href={url} target='_blank'>

            {/* If top article is true show top article card */}
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
                {/* If image defined */}
                {image && (
                    <img src={image} alt={title} className={styles.image} />
                )}
            </div >
        </a >
    )
}