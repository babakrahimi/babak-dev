import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

export default function Contact() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/babakrahimi",
      icon: Github
    },
    {
      name: "LinkedIn", 
      url: "https://linkedin.com/in/babakrahimi",
      icon: Linkedin
    },
    {
      name: "Twitter",
      url: "https://twitter.com/babakrahimi",
      icon: Twitter
    },
    {
      name: "Instagram",
      url: "https://instagram.com/babakrahimi",
      icon: Instagram
    }
  ];

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-title">Get In Touch</h2>
      <div className="section-content">
        <p className="contact-intro">
          I'm always open to discussing new opportunities, interesting projects, 
          or just having a chat about technology and development.
        </p>
        
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon size={20} className="social-icon" />
            </motion.a>
          ))}
        </div>

        <motion.div 
          className="email-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>Or reach out directly:</p>
          <a href="mailto:babak@babak.dev" className="email-link">
            <Mail size={20} className="email-icon" />
            babak@babak.dev
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}