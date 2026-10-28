import { useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import articles from './data/articles.js'
import './App.css'
import Article from './assets/Article.jsx'

const categories = ['All', 'Sports', 'Technology', 'Business', 'Health', 'Politics', 'General']
const articlesPerPage = 6

const heroVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: 'easeOut' },
  },
}

const articleVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: Math.min(index * 0.055, 0.28), ease: 'easeOut' },
  }),
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

const mobileMenuVariants = {
  closed: { opacity: 0, y: -8, height: 0 },
  open: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: { duration: 0.22, ease: 'easeOut' },
  },
}

function scrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    bookmark: <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function SearchBar({ query, onChange }) {
  return (
    <label className="search-field">
      <Icon name="search" size={17} />
      <span className="sr-only">Search sample stories</span>
      <input
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search stories..."
      />
      {query && (
        <button
          className="search-clear"
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <Icon name="close" size={15} />
        </button>
      )}
    </label>
  )
}

function NavigationItems({ view, savedCount, onSelect }) {
  return (
    <>
      <button className={view === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => onSelect('home')}>Home</button>
      <button className={view === 'trending' ? 'nav-link active' : 'nav-link'} onClick={() => onSelect('trending')}>Trending</button>
      <button className={view === 'saved' ? 'nav-link active' : 'nav-link'} onClick={() => onSelect('saved')}>
        Saved <span className="saved-count">{savedCount}</span>
      </button>
      <button className="nav-link" onClick={() => onSelect('about')}>About</button>
    </>
  )
}

function Navbar({ view, onNavigate, query, onSearchChange, savedCount }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(nextView) {
    onNavigate(nextView)
    setMenuOpen(false)
    if (nextView === 'home') {
      window.scrollTo({ top: 0, behavior: scrollBehavior() })
    } else if (nextView === 'about') {
      document.getElementById('about')?.scrollIntoView({ behavior: scrollBehavior() })
    } else {
      document.getElementById('stories')?.scrollIntoView({ behavior: scrollBehavior() })
    }
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand" href="#top" onClick={() => navigate('home')} aria-label="NewsHub home">
          <span className="brand-mark"><span /></span>
          <span>news<span className="brand-accent">hub</span></span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={21} />
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <NavigationItems view={view} savedCount={savedCount} onSelect={navigate} />
        </nav>

        <div className="nav-search">
          <SearchBar query={query} onChange={onSearchChange} />
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              className="mobile-menu-panel"
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <nav aria-label="Mobile navigation links">
                <NavigationItems view={view} savedCount={savedCount} onSelect={navigate} />
              </nav>
              <div className="mobile-menu-search">
                <SearchBar query={query} onChange={onSearchChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function HeroSection({ onExplore }) {
  return (
    <motion.section
      className="hero-section"
      id="top"
      aria-labelledby="hero-title"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-copy">
        <div className="eyebrow"><span className="live-dot" /> YOUR WORLD, IN FOCUS</div>
        <motion.h1 id="hero-title" variants={heroItemVariants}>Real news.<br /><span>Your way.</span></motion.h1>
        <motion.p variants={heroItemVariants}>Stay informed with the stories that matter. Choose your interests and explore the world, one topic at a time.</motion.p>
        <motion.button
          className="button button-primary hero-cta"
          type="button"
          onClick={onExplore}
          variants={heroItemVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Explore the stories <Icon name="arrow" size={17} />
        </motion.button>
        <div className="hero-note"><Icon name="spark" size={16} /> A clearer view of what matters</div>
      </div>

      <div className="hero-art" aria-label="Illustration of a connected globe with floating news topics" role="img">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="globe">
          <div className="globe-latitude latitude-one" />
          <div className="globe-latitude latitude-two" />
          <div className="globe-longitude" />
          <div className="globe-shine" />
        </div>
        <span className="orbit-point point-one" />
        <span className="orbit-point point-two" />
        <div className="topic-float float-tech"><span className="float-icon">✳</span><span><b>Technology</b><small>Ideas shaping tomorrow</small></span></div>
        <div className="topic-float float-world"><span className="float-icon">◉</span><span><b>World briefing</b><small>Stories without borders</small></span></div>
        <div className="hero-art-caption"><span /> THE BIGGER PICTURE</div>
      </div>
    </motion.section>
  )
}

function CategoryFilter({ selectedCategory, onSelect }) {
  return (
    <div className="category-list" aria-label="Filter stories by topic">
      {categories.map((category) => (
        <motion.button
          className={`category-button${selectedCategory === category ? ' selected' : ''}`}
          type="button"
          key={category}
          aria-pressed={selectedCategory === category}
          onClick={() => onSelect(category)}
          whileTap={{ scale: 0.96 }}
        >
          {selectedCategory === category && (
            <motion.span
              className="category-indicator"
              layoutId="active-category-indicator"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className="category-label">{category}</span>
        </motion.button>
      ))}
    </div>
  )
}

function BookmarkButton({ isSaved, onClick, title }) {
  return (
    <motion.button
      className={`bookmark-button${isSaved ? ' is-saved' : ''}`}
      type="button"
      aria-label={isSaved ? `Remove "${title}" from saved stories` : `Save "${title}"`}
      aria-pressed={isSaved}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.88 }}
    >
      <motion.span
        key={isSaved ? 'saved' : 'unsaved'}
        initial={{ scale: 0.7, rotate: -12, opacity: 0.6 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20 }}
      >
        <Icon name={isSaved ? 'check' : 'bookmark'} size={17} />
      </motion.span>
    </motion.button>
  )
}

function NewsCard({ article, isSaved, onToggleSaved, index }) {
  return (
    <motion.article
      className="news-card"
      layout
      custom={index}
      variants={articleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -4, boxShadow: '0 14px 34px rgba(0, 0, 0, 0.22), 0 0 18px rgba(56, 245, 165, 0.035)' }}
      transition={{ layout: { duration: 0.28 }, y: { duration: 0.2 }, boxShadow: { duration: 0.2 } }}
    >
      <Article
        article={article}
        bookmarkButton={
          <BookmarkButton
            isSaved={isSaved}
            onClick={() => onToggleSaved(article.id)}
            title={article.title}
          />
        }
        readTimeIcon={<Icon name="clock" size={14} />}
      />
    </motion.article>
  )
}

function EmptyState({ isSaved, query, onClear }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name={isSaved ? 'bookmark' : 'search'} size={22} /></div>
      <h3>{isSaved ? 'Your reading list is empty' : 'No stories found'}</h3>
      <p>{isSaved ? 'Save a story with the bookmark button and it will be waiting here.' : `We couldn't find a sample story${query ? ` matching “${query}”` : ''}. Try a different topic or search.`}</p>
      {!isSaved && <button className="text-button" type="button" onClick={onClear}>Clear filters <Icon name="arrow" size={15} /></button>}
    </div>
  )
}

function NewsGrid({ articlesToShow, savedIds, onToggleSaved }) {
  return (
    <motion.div layout className="news-grid">
      <AnimatePresence mode="popLayout">
      {articlesToShow.map((article, index) => (
        <NewsCard
          key={article.id}
          article={article}
          isSaved={savedIds.includes(article.id)}
          onToggleSaved={onToggleSaved}
          index={index}
        />
      ))}
      </AnimatePresence>
    </motion.div>
  )
}

function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-main">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark"><span /></span>
          <span>news<span className="brand-accent">hub</span></span>
        </a>
        <p>A little more signal.<br />A lot less noise.</p>
        <div className="footer-links">
          <a href="mailto:hello@newshub.example?subject=Privacy">Privacy</a>
          <a href="mailto:hello@newshub.example?subject=Terms">Terms</a>
          <a href="mailto:hello@newshub.example">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NewsHub. Made for curious minds.</span>
        <span className="demo-disclaimer">An independent sample-news demo — not a live news service.</span>
      </div>
    </footer>
  )
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedIds, setSavedIds] = useState([])
  const [view, setView] = useState('home')
  const [visibleCount, setVisibleCount] = useState(articlesPerPage)

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      const articleText = `${article.title} ${article.summary}`.toLowerCase()
      const matchesSearch = !normalizedQuery || (
        normalizedQuery.length <= 2
          ? articleText.split(/\W+/).includes(normalizedQuery)
          : articleText.includes(normalizedQuery)
      )
      const matchesSaved = view !== 'saved' || savedIds.includes(article.id)

      return matchesCategory && matchesSearch && matchesSaved
    })
  }, [searchQuery, selectedCategory, savedIds, view])

  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const isSavedView = view === 'saved'

  function updateSearch(query) {
    setSearchQuery(query)
    setVisibleCount(articlesPerPage)
  }

  function selectCategory(category) {
    setSelectedCategory(category)
    setVisibleCount(articlesPerPage)
  }

  function toggleSaved(articleId) {
    setSavedIds((currentIds) => (
      currentIds.includes(articleId)
        ? currentIds.filter((id) => id !== articleId)
        : [...currentIds, articleId]
    ))
  }

  function changeView(nextView) {
    if (nextView === 'trending') {
      setView('trending')
      selectCategory('All')
      updateSearch('')
    } else if (nextView === 'saved') {
      setView('saved')
      setVisibleCount(articlesPerPage)
    } else if (nextView === 'home') {
      setView('home')
    }
  }

  function exploreStories() {
    document.getElementById('stories')?.scrollIntoView({ behavior: scrollBehavior() })
  }

  return (

    


    <MotionConfig reducedMotion="user">
    <>
      <Navbar
        view={view}
        onNavigate={changeView}
        query={searchQuery}
        onSearchChange={updateSearch}
        savedCount={savedIds.length}
      />
      <main>
        <div className="page-shell">
          {!isSavedView && <HeroSection onExplore={exploreStories} />}
          <section className="stories-section" id="stories" aria-labelledby="stories-title">
            <div className="section-heading">
              <div>
                <div className="eyebrow section-eyebrow"><span className="live-dot" /> THE DAILY EDIT</div>
                <h2 id="stories-title">{isSavedView ? 'Your saved stories' : view === 'trending' ? 'Trending right now.' : 'Stories worth your time.'}</h2>
                <p>{isSavedView ? 'A personal reading list, saved for whenever you have a moment.' : view === 'trending' ? 'A sample selection of stories readers are exploring across every topic.' : 'A thoughtful mix of the ideas, events, and perspectives moving the world.'}</p>
              </div>
              <div className="edition-note"><span className="edition-dot" /> SAMPLE EDITION <span className="edition-divider" /> UPDATED DAILY</div>
            </div>

            <div className="filter-row">
              <CategoryFilter selectedCategory={selectedCategory} onSelect={selectCategory} />
              <span className="results-count">{filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'}</span>
            </div>

            {(searchQuery || selectedCategory !== 'All') && (
              <div className="filter-summary" aria-live="polite">
                Showing {selectedCategory === 'All' ? 'all topics' : selectedCategory}
                {searchQuery && <> matching <strong>“{searchQuery}”</strong></>}
              </div>
            )}

            <NewsGrid articlesToShow={visibleArticles} savedIds={savedIds} onToggleSaved={toggleSaved} />
            <AnimatePresence initial={false} mode="wait">
              {visibleArticles.length === 0 && (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <EmptyState
                    isSaved={isSavedView}
                    query={searchQuery}
                    onClear={() => {
                      updateSearch('')
                      selectCategory('All')
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {visibleArticles.length > 0 && visibleCount < filteredArticles.length && (
              <div className="load-more-wrap">
                <motion.button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setVisibleCount((count) => count + articlesPerPage)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Load more stories <span className="load-more-count">({filteredArticles.length - visibleCount} left)</span>
                </motion.button>
              </div>
            )}
          </section>
          <div className="sample-notice"><Icon name="spark" size={15} /> All articles are original sample content created for this demo. They do not describe verified real-world events.</div>
        </div>
      </main>
      <Footer />
    </>
    </MotionConfig>

    
  )
}

export default App
