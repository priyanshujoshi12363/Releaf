// BoxTransition.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BoxTransition = ({ children, trigger }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (trigger) {
      setVisible(false); // play exit animation
      const timer = setTimeout(() => setVisible(true), 800); // after exit, show new
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="relative flex justify-center items-center h-full">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={Date.now()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="glass-box p-8 rounded-2xl shadow-lg backdrop-blur-md bg-white/10 border border-white/20"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoxTransition;
