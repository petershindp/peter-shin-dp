export const Contact = () => (
    <div className="contact">
      <h2 className="section-title">Contact</h2>
      <form className="contact-form">
        <input className="form-input" type="text" placeholder="Name" />
        <input className="form-input" type="email" placeholder="Email" />
        <textarea className="form-textarea" rows="4" placeholder="Message" />
        <button type="submit" className="form-button">Send</button>
      </form>
    </div>
  );