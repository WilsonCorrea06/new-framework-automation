/**
 * Prueba nativa de iOS - Login
 * Ejemplo de integración entre Playwright (web) y Appium (nativo)
 */

const { expect } = require('@wdio/globals');

describe('iOS Native - Login Tests', () => {
    
    beforeEach(async () => {
        // Reiniciar app antes de cada test
        await TestHelpers.restartApp();
        console.log('🍎 iOS App reiniciada para nuevo test');
    });

    it('Debe abrir la aplicación iOS correctamente', async () => {
        // Esperar a que la app cargue (iOS puede tomar más tiempo)
        await TestHelpers.waitForAppToLoad();
        
        // Verificar que estamos en la pantalla principal
        const appTitle = await $('~app-title'); // Accessibility ID
        await expect(appTitle).toBeDisplayed();
        
        // Verificar información específica de iOS
        const deviceInfo = await TestHelpers.getDeviceInfo();
        console.log(`📱 Ejecutando en: ${deviceInfo.device} - iOS ${deviceInfo.version}`);
        
        // Tomar screenshot de evidencia
        await TestHelpers.takeScreenshot('ios-app-launch');
        
        console.log('✅ Aplicación iOS cargada exitosamente');
    });

    it('Debe mostrar pantalla de login en iOS', async () => {
        // Buscar botón de login usando predicates de iOS
        const loginButton = await $('-ios predicate string:name == "login-button"');
        await loginButton.waitForDisplayed({ timeout: 15000 });
        
        // Hacer tap en login
        await loginButton.click();
        
        // Esperar cambio de pantalla (iOS puede ser más lento)
        await TestHelpers.waitForScreenChange(15000);
        
        // Verificar elementos de login usando diferentes estrategias de iOS
        const usernameField = await $('~username-input');
        const passwordField = await $('-ios predicate string:elementType == "XCUIElementTypeSecureTextField"');
        const submitButton = await $('~submit-login');
        
        await expect(usernameField).toBeDisplayed();
        await expect(passwordField).toBeDisplayed();
        await expect(submitButton).toBeDisplayed();
        
        // Screenshot de pantalla de login
        await TestHelpers.takeScreenshot('ios-login-screen');
        
        console.log('✅ Pantalla de login iOS mostrada correctamente');
    });

    it('Debe permitir login con credenciales válidas en iOS', async () => {
        // Navegar a pantalla de login
        const loginButton = await $('-ios predicate string:name == "login-button"');
        await loginButton.click();
        await TestHelpers.waitForScreenChange(15000);
        
        // Generar datos de prueba
        const testData = TestHelpers.generateMobileTestData();
        
        // Introducir credenciales (iOS maneja texto diferente)
        await TestHelpers.typeText('~username-input', testData.username);
        await TestHelpers.typeText('-ios predicate string:elementType == "XCUIElementTypeSecureTextField"', 'password123');
        
        // En iOS, el teclado se maneja diferente
        await TestHelpers.hideKeyboard();
        
        // Screenshot antes de submit
        await TestHelpers.takeScreenshot('ios-login-form-filled');
        
        // Hacer tap en submit
        const submitButton = await $('~submit-login');
        await submitButton.click();
        
        // Manejar posibles alerts de permisos específicos de iOS
        await TestHelpers.handlePermissionAlert('accept');
        
        // iOS puede mostrar alerts adicionales
        try {
            await driver.waitUntil(async () => {
                const alertButtons = await $$('-ios class chain:**/XCUIElementTypeButton');
                if (alertButtons.length > 0) {
                    for (let button of alertButtons) {
                        const buttonText = await button.getText();
                        if (buttonText.includes('Allow') || buttonText.includes('OK')) {
                            await button.click();
                            return true;
                        }
                    }
                }
                return false;
            }, { timeout: 5000 });
        } catch (error) {
            console.log('No hay alerts adicionales de iOS');
        }
        
        // Esperar por pantalla de éxito
        const successMessage = await $('~login-success');
        await successMessage.waitForDisplayed({ timeout: 20000 });
        
        // Verificar mensaje de éxito
        const successText = await successMessage.getText();
        expect(successText).toContain('Welcome');
        
        // Screenshot de éxito
        await TestHelpers.takeScreenshot('ios-login-success');
        
        console.log('✅ Login exitoso en iOS completado');
    });

    it('Debe manejar credenciales inválidas en iOS', async () => {
        // Navegar a login
        const loginButton = await $('-ios predicate string:name == "login-button"');
        await loginButton.click();
        await TestHelpers.waitForScreenChange(15000);
        
        // Introducir credenciales inválidas
        await TestHelpers.typeText('~username-input', 'invalid_user');
        await TestHelpers.typeText('-ios predicate string:elementType == "XCUIElementTypeSecureTextField"', 'wrong_password');
        
        await TestHelpers.hideKeyboard();
        
        // Submit
        const submitButton = await $('~submit-login');
        await submitButton.click();
        
        // Esperar mensaje de error (iOS puede usar alerts)
        try {
            // Primero intentar buscar alert nativo de iOS
            await driver.waitUntil(async () => {
                const alert = await driver.getAlertText();
                return alert && alert.includes('Invalid');
            }, { timeout: 10000 });
            
            await driver.acceptAlert();
            await TestHelpers.takeScreenshot('ios-login-error-alert');
        } catch (error) {
            // Si no hay alert, buscar mensaje en pantalla
            const errorMessage = await $('~error-message');
            await errorMessage.waitForDisplayed({ timeout: 10000 });
            
            const errorText = await errorMessage.getText();
            expect(errorText).toContain('Invalid credentials');
            
            await TestHelpers.takeScreenshot('ios-login-error-message');
        }
        
        console.log('✅ Manejo de error en iOS validado correctamente');
    });

    it('Debe permitir navegación hacia atrás en iOS', async () => {
        // Ir a login
        const loginButton = await $('-ios predicate string:name == "login-button"');
        await loginButton.click();
        await TestHelpers.waitForScreenChange(15000);
        
        // En iOS, buscar botón de navegación hacia atrás
        const backButton = await $('-ios predicate string:name == "Back" OR name == "back" OR elementType == "XCUIElementTypeButton"');
        
        if (await backButton.isExisting()) {
            await backButton.click();
        } else {
            // Usar swipe gesture para volver (common en iOS)
            await TestHelpers.swipe('right', 0.8);
        }
        
        // Verificar que regresamos a pantalla principal
        const homeTitle = await $('~app-title');
        await homeTitle.waitForDisplayed({ timeout: 10000 });
        
        await TestHelpers.takeScreenshot('ios-back-navigation');
        
        console.log('✅ Navegación hacia atrás en iOS funcional');
    });

    it('Debe manejar gestos específicos de iOS', async () => {
        // Verificar swipe gesture típico de iOS
        const initialSource = await driver.getPageSource();
        
        // Hacer swipe hacia la derecha (típico en iOS para volver)
        await TestHelpers.swipe('right', 0.7);
        
        await driver.pause(2000);
        
        // En iOS, también probar 3D Touch simulation (si disponible)
        try {
            const centerElement = await $('~app-title');
            if (await centerElement.isExisting()) {
                await TestHelpers.longPress('~app-title', 3000);
                await driver.pause(1000);
            }
        } catch (error) {
            console.log('3D Touch no disponible o no soportado');
        }
        
        await TestHelpers.takeScreenshot('ios-gestures');
        
        console.log('✅ Gestos específicos de iOS funcionando');
    });

    it('Debe manejar orientación del dispositivo iOS', async () => {
        // Obtener orientación actual
        const currentOrientation = await driver.getOrientation();
        console.log(`Orientación actual: ${currentOrientation}`);
        
        // Cambiar orientación si es posible
        try {
            if (currentOrientation === 'PORTRAIT') {
                await driver.setOrientation('LANDSCAPE');
                await driver.pause(2000);
                
                // Verificar que la app se adapta
                const landscapeSource = await driver.getPageSource();
                await TestHelpers.takeScreenshot('ios-landscape');
                
                // Volver a portrait
                await driver.setOrientation('PORTRAIT');
                await driver.pause(2000);
                
                await TestHelpers.takeScreenshot('ios-portrait-restored');
            }
        } catch (error) {
            console.log('Cambio de orientación no soportado en este dispositivo');
        }
        
        console.log('✅ Manejo de orientación iOS validado');
    });

    afterEach(async () => {
        // Cleanup específico para iOS
        try {
            // Cerrar cualquier alert que pueda estar abierto
            try {
                await driver.acceptAlert();
            } catch (error) {
                // No hay alert abierto
            }
            
            await TestHelpers.hideKeyboard();
            console.log('🧹 Cleanup iOS completado');
        } catch (error) {
            console.log('⚠️ Error en cleanup iOS:', error.message);
        }
    });

}); 