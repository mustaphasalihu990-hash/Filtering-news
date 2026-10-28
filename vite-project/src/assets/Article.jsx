import { useState } from 'react'
import '../Article.css'

export default function Article({ article, bookmarkButton, readTimeIcon }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <>
      <div className={`card-image-wrap image-tone-${article.imageTone}`}>
        {!imageFailed ? (
          <img
            className="card-image"
            src={article.image}
            alt={article.imageAlt}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="image-fallback" aria-label={article.imageAlt} role="img">
            <span>{article.category}</span>
          </div>
        )}
        <span className="article-category">{article.category}</span>
        {bookmarkButton}
      </div>
      <div className="card-content article-card-content">
        <div className="article-meta">
          <span>{article.publishedAt}</span>
          <span className="meta-dot">·</span>
          <span>{article.readingMinutes} min read</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <div className="card-bottom">
          <span className="sample-label">SAMPLE STORY</span>
          <span className="read-time">{readTimeIcon} {article.readingMinutes} min</span>
        </div>
      </div>
    </>
  )
}














