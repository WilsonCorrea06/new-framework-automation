/**
 * Configuración de WebDriverIO para pruebas nativas Android
 * Integrada con el framework de automatización Playwright existente
 */

const path = require('path');

exports.config = {
    // Runner
    runner: 'local',
    
    // Especificar el port de Appium
    port: 4723,
    path: '/',
    
    // Capabilities para Android
    capabilities: [{
        // Plataforma y versión
        'platformName': 'Android',
        'appium:platformVersion': '12', // Android 12 para Pixel 6
        'appium:deviceName': 'Pixel_6', // Configurado específicamente para Pixel 5
        'appium:automationName': 'UiAutomator2',
        
        // Aplicación a probar - TU APK REAL
        'appium:app': path.join(process.cwd(), 'apps/android/app-debug.apk'),
        // Appium auto-detectará el package y activity desde el APK
        // Si necesitas especificar manualmente, descomenta y ajusta:
        // 'appium:appPackage': 'com.tu.app.package',
        // 'appium:appActivity': '.MainActivity',
        
        // Configuraciones adicionales
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        
        // Configuraciones de rendimiento
        'appium:skipDeviceInitialization': false,
        'appium:skipServerInstallation': false,
        'appium:ignoreHiddenApiPolicyError': true,
        
        // Configuraciones de logs
        'appium:enablePerformanceLogging': true,
        'appium:printPageSourceOnFindFailure': true,
    }],
    
    // Test Files
    specs: [
        './src/features/mobile/android/**/*.native.spec.js'
    ],
    
    // Exclude Files
    exclude: [],
    
    // Test Configuration
    maxInstances: 1, // Solo una instancia para mobile
    
    // Level of logging verbosity
    logLevel: 'info',
    
    // Base URL
    baseUrl: 'http://localhost',
    
    // Default timeout for all waitFor* commands
    waitforTimeout: 30000,
    
    // Default timeout in milliseconds for request
    connectionRetryTimeout: 120000,
    
    // Default request retries count
    connectionRetryCount: 3,
    
    // Services - sin auto-start de Appium
    services: [],
    
    // Framework
    framework: 'mocha',
    
    // Test reporter
    reporters: ['spec'],
    
    // Options to be passed to Mocha
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    
    // Hooks
    onPrepare: function (config, capabilities) {
        console.log('🚀 Iniciando pruebas nativas Android...');
        
        // Importar hooks de limpieza
        const cleanupHooks = require('./hooks/cleanup.hooks');
        
        // Verificar estado antes de las pruebas
        return cleanupHooks.beforeTestSuite();
    },
    
    before: function (capabilities, specs) {
        // Importar helpers
        global.TestHelpers = require('../src/utils/AppiumHelpers');
        
        // Configurar timeouts implícitos
        driver.setTimeout({ 'implicit': 30000 });
    },
    
    beforeTest: function (test, context) {
        console.log(`📱 Ejecutando: ${test.title}`);
    },
    
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            // Tomar screenshot en caso de error
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `evidence/screenshots/android-error-${timestamp}.png`;
            driver.saveScreenshot(filename);
            console.log(`📸 Screenshot guardado: ${filename}`);
        }
        
        // Usar hook de limpieza para manejo de errores
        const cleanupHooks = require('./hooks/cleanup.hooks');
        cleanupHooks.afterEachTest(test, context, { error, result, duration, passed, retries });
    },
    
    after: function (result, capabilities, specs) {
        console.log('🏁 Pruebas Android completadas');
        
        // Usar hook de limpieza después de las pruebas
        const cleanupHooks = require('./hooks/cleanup.hooks');
        return cleanupHooks.afterTestSuite();
    },
    
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('📊 Generando reportes...');
        
        // Usar el hook de limpieza automática
        const cleanupHooks = require('./hooks/cleanup.hooks');
        cleanupHooks.executeCleanup();
    }
}; 