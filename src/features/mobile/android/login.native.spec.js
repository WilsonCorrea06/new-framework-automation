/**
 * Prueba nativa de Android - Login
 * Ejemplo de integración entre Playwright (web) y Appium (nativo)
 */

const { expect } = require('@wdio/globals');

describe('Android Native - Login Tests', () => {
    
    beforeEach(async () => {
        // Reiniciar app antes de cada test
        await TestHelpers.restartApp();
        console.log('📱 App reiniciada para nuevo test');
    });

    it('Debe abrir la aplicación correctamente', async () => {
        // Esperar a que la app cargue
        await TestHelpers.waitForAppToLoad();
        
        // Verificar que estamos en la pantalla principal
        const splashTitle = await $('~app-title'); // Accessibility ID
        await expect(splashTitle).toBeDisplayed();
        
        // Tomar screenshot de evidencia
        await TestHelpers.takeScreenshot('app-launch');
        
        console.log('✅ Aplicación cargada exitosamente');
    });

    it('Debe mostrar pantalla de login', async () => {
        // Buscar botón de login
        const loginButton = await $('~login-button');
        await loginButton.waitForDisplayed({ timeout: 10000 });
        
        // Hacer tap en login
        await loginButton.click();
        
        // Esperar cambio de pantalla
        await TestHelpers.waitForScreenChange();
        
        // Verificar elementos de login
        const usernameField = await $('~username-input');
        const passwordField = await $('~password-input');
        const submitButton = await $('~submit-login');
        
        await expect(usernameField).toBeDisplayed();
        await expect(passwordField).toBeDisplayed();
        await expect(submitButton).toBeDisplayed();
        
        // Screenshot de pantalla de login
        await TestHelpers.takeScreenshot('login-screen');
        
        console.log('✅ Pantalla de login mostrada correctamente');
    });

    it('Debe permitir login con credenciales válidas', async () => {
        // Navegar a pantalla de login
        const loginButton = await $('~login-button');
        await loginButton.click();
        await TestHelpers.waitForScreenChange();
        
        // Generar datos de prueba
        const testData = TestHelpers.generateMobileTestData();
        
        // Introducir credenciales
        await TestHelpers.typeText('~username-input', testData.username);
        await TestHelpers.typeText('~password-input', 'password123');
        
        // Ocultar teclado si está visible
        await TestHelpers.hideKeyboard();
        
        // Screenshot antes de submit
        await TestHelpers.takeScreenshot('login-form-filled');
        
        // Hacer tap en submit
        const submitButton = await $('~submit-login');
        await submitButton.click();
        
        // Manejar posibles permisos
        await TestHelpers.handlePermissionAlert('accept');
        
        // Esperar por pantalla de éxito
        const successMessage = await $('~login-success');
        await successMessage.waitForDisplayed({ timeout: 15000 });
        
        // Verificar mensaje de éxito
        const successText = await successMessage.getText();
        expect(successText).toContain('Welcome');
        
        // Screenshot de éxito
        await TestHelpers.takeScreenshot('login-success');
        
        console.log('✅ Login exitoso completado');
    });

    it('Debe manejar credenciales inválidas', async () => {
        // Navegar a login
        const loginButton = await $('~login-button');
        await loginButton.click();
        await TestHelpers.waitForScreenChange();
        
        // Introducir credenciales inválidas
        await TestHelpers.typeText('~username-input', 'invalid_user');
        await TestHelpers.typeText('~password-input', 'wrong_password');
        
        await TestHelpers.hideKeyboard();
        
        // Submit
        const submitButton = await $('~submit-login');
        await submitButton.click();
        
        // Esperar mensaje de error
        const errorMessage = await $('~error-message');
        await errorMessage.waitForDisplayed({ timeout: 10000 });
        
        // Verificar mensaje de error
        const errorText = await errorMessage.getText();
        expect(errorText).toContain('Invalid credentials');
        
        // Screenshot de error
        await TestHelpers.takeScreenshot('login-error');
        
        console.log('✅ Manejo de error validado correctamente');
    });

    it('Debe permitir navegación hacia atrás', async () => {
        // Ir a login
        const loginButton = await $('~login-button');
        await loginButton.click();
        await TestHelpers.waitForScreenChange();
        
        // Usar navegación nativa hacia atrás
        await driver.back();
        
        // Verificar que regresamos a pantalla principal
        const homeTitle = await $('~app-title');
        await homeTitle.waitForDisplayed({ timeout: 5000 });
        
        await TestHelpers.takeScreenshot('back-navigation');
        
        console.log('✅ Navegación hacia atrás funcional');
    });

    it('Debe manejar gestos táctiles', async () => {
        // Verificar swipe en pantalla principal
        const initialSource = await driver.getPageSource();
        
        // Hacer swipe hacia la izquierda
        await TestHelpers.swipe('left');
        
        // Esperar cambio
        await driver.pause(2000);
        
        // Verificar que la pantalla cambió
        const newSource = await driver.getPageSource();
        expect(newSource).not.toEqual(initialSource);
        
        await TestHelpers.takeScreenshot('swipe-gesture');
        
        console.log('✅ Gestos táctiles funcionando');
    });

    afterEach(async () => {
        // Cleanup después de cada test
        try {
            await TestHelpers.hideKeyboard();
            console.log('🧹 Cleanup completado');
        } catch (error) {
            console.log('⚠️ Error en cleanup:', error.message);
        }
    });

}); 