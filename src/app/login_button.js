import React from 'react';
import styles from './components/login_button.module.css'

export function LoginButton() {
    return (
        <button className={styles.login_button}>
            Login
        </button>
    );
}
