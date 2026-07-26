export default function Footer() {
  return (
    <footer className="footer-masterpiece">
      <div className="footer-bg-overlay"></div>
      <div className="footer-content">
        <h1 className="massive-thank-you text-outline">THANK YOU</h1>
        <div className="footer-contact">
          <p><a href="mailto:lebachanhtruc@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>lebachanhtruc@gmail.com</a></p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/lebachanhtruc" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>in</span>
              <span>/lebachanhtruc</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
