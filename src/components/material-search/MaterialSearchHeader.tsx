
import React from 'react';
import { motion } from 'framer-motion';

interface MaterialSearchHeaderProps {
  title: string;
  description: string;
}

const MaterialSearchHeader: React.FC<MaterialSearchHeaderProps> = ({
  title,
  description
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className="text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

export default MaterialSearchHeader;
