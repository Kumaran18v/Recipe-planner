import React from 'react';
import RecipeTable from '../components/RecipeTable';
import { motion } from 'framer-motion';

const RecipeList = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-bg-dark text-text-light font-body"
        >
            <RecipeTable />
        </motion.div>
    );
};

export default RecipeList;
