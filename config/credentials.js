/**
 * Credentials Management Module
 * Handles secure access to environment variables and test credentials
 */

require('dotenv').config();

/**
 * Test Credentials Configuration
 * These are loaded from environment variables for security
 */
const credentials = {
    qa: {
        phoneNumber: process.env.QA_PHONE_NUMBER || '2542542589',
        password: process.env.QA_PASSWORD || 'Wc123456!',
        environment: 'QA'
    },
    dev: {
        phoneNumber: process.env.DEV_PHONE_NUMBER || '',
        password: process.env.DEV_PASSWORD || '',
        environment: 'DEV'
    },
    prod: {
        phoneNumber: process.env.PROD_PHONE_NUMBER || '',
        password: process.env.PROD_PASSWORD || '',
        environment: 'PROD'
    }
};

/**
 * Get credentials for specific environment
 * @param {string} environment - Environment name (qa, dev, prod)
 * @returns {object} Credentials object
 */
function getCredentials(environment = 'qa') {
    const env = environment.toLowerCase();
    
    if (!credentials[env]) {
        throw new Error(`Environment '${environment}' not found. Available: qa, dev, prod`);
    }
    
    const creds = credentials[env];
    
    // Validate that credentials exist
    if (!creds.phoneNumber || !creds.password) {
        throw new Error(`Credentials not configured for environment '${environment}'. Please check your .env file.`);
    }
    
    return {
        phoneNumber: creds.phoneNumber,
        password: creds.password,
        environment: creds.environment
    };
}

/**
 * Get current test environment from env vars
 * @returns {string} Current environment
 */
function getCurrentEnvironment() {
    return process.env.TEST_ENVIRONMENT || 'qa';
}

/**
 * Get credentials for current environment
 * @returns {object} Current environment credentials
 */
function getCurrentCredentials() {
    const currentEnv = getCurrentEnvironment();
    return getCredentials(currentEnv);
}

/**
 * Validate if credentials are properly configured
 * @param {string} environment - Environment to validate
 * @returns {boolean} True if valid
 */
function validateCredentials(environment = 'qa') {
    try {
        const creds = getCredentials(environment);
        return !!(creds.phoneNumber && creds.password);
    } catch (error) {
        console.warn(`Credential validation failed for ${environment}:`, error.message);
        return false;
    }
}

/**
 * Get masked credentials for logging (security)
 * @param {string} environment - Environment name
 * @returns {object} Masked credentials
 */
function getMaskedCredentials(environment = 'qa') {
    try {
        const creds = getCredentials(environment);
        return {
            phoneNumber: creds.phoneNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
            password: '*'.repeat(creds.password.length),
            environment: creds.environment
        };
    } catch (error) {
        return {
            phoneNumber: 'NOT_CONFIGURED',
            password: 'NOT_CONFIGURED',
            environment: environment.toUpperCase()
        };
    }
}

// Export functions
module.exports = {
    getCredentials,
    getCurrentEnvironment,
    getCurrentCredentials,
    validateCredentials,
    getMaskedCredentials,
    
    // Available environments
    ENVIRONMENTS: {
        QA: 'qa',
        DEV: 'dev',
        PROD: 'prod'
    }
};

// Log current configuration (masked for security)
if (require.main === module) {
    console.log('🔐 Credentials Configuration:');
    console.log('Current Environment:', getCurrentEnvironment());
    console.log('Available Environments:', Object.values(module.exports.ENVIRONMENTS));
    
    Object.values(module.exports.ENVIRONMENTS).forEach(env => {
        const isValid = validateCredentials(env);
        const masked = getMaskedCredentials(env);
        console.log(`\n${env.toUpperCase()} Environment:`);
        console.log(`  Status: ${isValid ? '✅ Configured' : '❌ Not Configured'}`);
        console.log(`  Phone: ${masked.phoneNumber}`);
        console.log(`  Password: ${masked.password}`);
    });
} 