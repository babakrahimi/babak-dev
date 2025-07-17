import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import About from './About';
import Contact from './Contact';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', component: About },
    { id: 'contact', component: Contact },
  ];

  return (
    <div className="app">
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Navigation onSectionChange={setActiveSection} />
        
        <div className="content">
          <AnimatePresence mode="wait">
            {sections.map((section) => 
              activeSection === section.id && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <section.component />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}