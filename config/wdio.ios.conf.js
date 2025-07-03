/**
 * Configuración de WebDriverIO para pruebas nativas iOS
 * Integrada con el framework de automatización Playwright existente
 */

const path = require('path');

exports.config = {
    // Runner
    runner: 'local',
    
    // Especificar el port de Appium
    port: 4723,
    path: '/',
    
    // Capabilities para iOS
    capabilities: [{
        // Plataforma y versión
        'platformName': 'iOS',
        'appium:platformVersion': '15.0', // Cambiar según tu dispositivo
        'appium:deviceName': 'iPhone 13', // Cambiar según tu simulador
        'appium:automationName': 'XCUITest',
        
        // Aplicación a probar
        'appium:app': path.join(process.cwd(), 'apps/ios/MyApp.app'),
        'appium:bundleId': 'com.example.app', // Cambiar por tu bundle ID
        
        // Configuraciones específicas de iOS
        'appium:udid': 'auto', // Para dispositivo real, especificar UDID
        'appium:xcodeOrgId': process.env.XCODE_ORG_ID, // Para dispositivos reales
        'appium:xcodeSigningId': 'iPhone Developer', // Para dispositivos reales
        
        // Configuraciones adicionales
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 240,
        'appium:autoAcceptAlerts': false,
        'appium:autoDismissAlerts': false,
        
        // Configuraciones de rendimiento
        'appium:waitForQuiescence': false,
        'appium:shouldUseSingletonTestManager': false,
        'appium:shouldUseTestManagerForVisibilityDetection': false,
        
        // Configuraciones de logs
        'appium:showIOSLog': true,
        'appium:printPageSourceOnFindFailure': true,
        
        // Configuraciones específicas del simulador
        'appium:simulatorStartupTimeout': 180000,
        'appium:launchTimeout': 180000,
    }],
    
    // Test Files
    specs: [
        './src/features/mobile/ios/**/*.native.spec.js'
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
    
    // Services
    services: [
        ['appium', {
            args: {
                // Configuraciones del servidor Appium
                address: 'localhost',
                port: 4723,
                relaxedSecurity: true,
                logLevel: 'info',
                // Configuraciones específicas para iOS
                defaultCapabilities: {
                    'appium:showIOSLog': true
                }
            },
            command: 'appium'
        }]
    ],
    
    // Framework
    framework: 'mocha',
    
    // Test reporter
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'reports/allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
        }],
        ['junit', {
            outputDir: 'reports/junit',
            outputFileFormat: function(options) {
                return `ios-results-${options.cid}.xml`
            }
        }]
    ],
    
    // Options to be passed to Mocha
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000, // Mayor timeout para iOS
        require: ['ts-node/register']
    },
    
    // Hooks
    onPrepare: function (config, capabilities) {
        console.log('🍎 Iniciando pruebas nativas iOS...');
    },
    
    before: function (capabilities, specs) {
        // Importar helpers
        global.TestHelpers = require('../src/utils/AppiumHelpers');
        
        // Configurar timeouts más altos para iOS
        driver.setTimeout({
            'implicit': 30000,
            'pageLoad': 60000,
            'script': 60000
        });
    },
    
    beforeTest: function (test, context) {
        console.log(`📱 Ejecutando: ${test.title}`);
    },
    
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            // Tomar screenshot en caso de error
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `evidence/screenshots/ios-error-${timestamp}.png`;
            driver.saveScreenshot(filename);
            console.log(`📸 Screenshot guardado: ${filename}`);
        }
    },
    
    after: function (result, capabilities, specs) {
        console.log('🏁 Pruebas iOS completadas');
    },
    
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('📊 Generando reportes...');
    }
}; 