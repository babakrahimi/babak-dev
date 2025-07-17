import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-title">About Me</h2>
      <div className="section-content">
        <p>
          Hello! I'm Babak Rahimi, a passionate developer who loves creating 
          beautiful and functional web experiences. I specialize in modern 
          web technologies and enjoy bringing ideas to life through code.
        </p>
        <p>
          When I'm not coding, you can find me exploring new technologies, 
          contributing to open source projects, or sharing knowledge with 
          the developer community.
        </p>
      </div>
    </motion.div>
  );
}