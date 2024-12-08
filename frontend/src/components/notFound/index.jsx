import React from 'react';
import styles from './styles.module.css';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <div className={styles.NotFound_container}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFound;