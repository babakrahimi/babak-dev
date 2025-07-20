import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail } from 'lucide-react';

interface NavigationProps {
  onSectionChange: (section: string) => void;
}

export default function Navigation({ onSectionChange }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', label: 'About', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const underlineWidth = 100 / sections.length;

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    onSectionChange(sectionId);
  };

  return (
    <nav className="navigation">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => handleSectionChange(section.id)}
        >
          <section.icon size={16} className="nav-icon" />
          <span className="nav-label">{section.label}</span>
        </button>
      ))}
      <motion.div
        className="nav-underline"
        style={{ width: `${underlineWidth}%` }}
        initial={false}
        animate={{
          x: `${activeIndex * 100}%`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </nav>
  );
}