"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    body: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real application, you would send this data to your backend
    // For now, we'll just log it and show a success message
    console.log('Form submitted:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your message! We\'ll get back to you soon.');
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      body: ''
    });
  };

  return (
    <div className="contact-form spacing-style size-style" 
      style={{
        paddingBlockStart: '0px',
        paddingBlockEnd: '0px',
        paddingInlineStart: '0px',
        paddingInlineEnd: '0px',
        width: '50%',
        height: 'auto'
      }}
    >
      <form 
        method="post" 
        onSubmit={handleSubmit}
        className="contact-form__form"
        style={{ width: '100%' }}
      >
        <div className="contact-form__form-row">
          <label className="visually-hidden" htmlFor="ContactForm-name">
            Name
          </label>
          <input
            type="text"
            id="ContactForm-name"
            className="contact-form__input"
            autoComplete="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          
          <label className="visually-hidden" htmlFor="ContactForm-email">
            Email<span aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="ContactForm-email"
            className="contact-form__input"
            autoComplete="email"
            name="email"
            spellCheck="false"
            autoCapitalize="off"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            placeholder="Email"
            required
          />
        </div>
        
        <label className="visually-hidden" htmlFor="ContactForm-phone">
          Phone
        </label>
        <input
          type="tel"
          id="ContactForm-phone"
          className="contact-form__input"
          autoComplete="tel"
          name="phone"
          pattern="[0-9\-]*"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        
        <label className="visually-hidden" htmlFor="ContactForm-body">
          Comment
        </label>
        <textarea
          rows={10}
          id="ContactForm-body"
          className="contact-form__input contact-form__input--textarea"
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Comment"
          required
        />
        
        <button
          type="submit"
          className="button submit-button size-style button btn-primary"
          disabled={isSubmitting}
          style={{
            width: 'fit-content',
            height: 'auto',
            marginTop: '20px'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}