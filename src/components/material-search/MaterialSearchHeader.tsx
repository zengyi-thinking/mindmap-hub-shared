import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/pages/material-search/MaterialSearch.module.css';

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
          className={`text-3xl ${styles.mainTitle} text-primary`}
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className={`text-muted-foreground ${styles.hintText}`}
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

export default MaterialSearchHeader;
