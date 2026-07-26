export default function Director() {
  return (
    <section id="director" className="director-section">
      <div className="container">
        <div className="director-content animate-fade-in">
          <p>
            "A masterpiece is not born from compromise. It is forged through an unrelenting pursuit of visual perfection and storytelling. Every frame, every pixel must serve a purpose."
          </p>
          <form className="contact-form glass-panel" style={{ padding: '3rem' }}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="What is your vision?" rows={4} required></textarea>
            <button type="button" className="submit-btn">Initiate Project</button>
          </form>
        </div>
      </div>
    </section>
  )
}
