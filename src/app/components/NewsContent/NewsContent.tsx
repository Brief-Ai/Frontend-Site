'use client'

import ArticleCard from './ArticleCard/ArticleCard'
import styles from './NewsContent.module.scss'

export default function NewsContent() {

    return (
        <section className={styles.wrapper}>
            <div className={styles.articles}>
                <ArticleCard
                    title='Nadal withdraws from U.S. Open'
                    content='Rafael Nadal is officially OUT of the U.S. Open the tennis legend said Tuesday...'
                    // Date in unix time
                    date={"2023-07-26T17:19:52+00:00"}
                />
            </div>

        </section >
    )
}