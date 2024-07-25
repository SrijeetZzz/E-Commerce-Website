import React from 'react';
import '../styles/Contact.css'; // Import CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


function Contact() {
  return (
    <div className="container">
      
      <div className="cntct">
      <h1>Contact Us</h1>
      <div className="contact-info">
        <div className="contact-detail">
          <FontAwesomeIcon icon={faPhone} className="icon" />
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
        </div>
        <div className="contact-detail">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <p><strong>Email:</strong> info@example.com</p>
        </div>
        <div className="contact-detail">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
          <p><strong>Address:</strong> 123 Main St, City, Country, 12345</p>
        </div>
        <div className="availability">
        <p>We're available Monday to Friday, from 9:00 AM to 5:00 PM (local time).</p>
      </div>
      </div>
      </div>
      
      
    </div>
  );
}

export default Contact;
