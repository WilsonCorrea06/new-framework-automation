/**
 * Helpers de Appium para automatización nativa móvil
 * Complementa las funcionalidades de Playwright para pruebas nativas
 */

class AppiumHelpers {
    /**
     * Esperar por elemento con diferentes estrategias
     */
    static async waitForElement(selector, timeout = 30000, strategy = 'accessibility id') {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    }

    /**
     * Tap en elemento con coordenadas relativas
     */
    static async tapByCoordinates(x, y) {
        await driver.touchAction({
            action: 'tap',
            x: x,
            y: y
        });
    }

    /**
     * Swipe gesture con direcciones
     */
    static async swipe(direction, distance = 0.5) {
        const { width, height } = await driver.getWindowSize();
        
        let startX, startY, endX, endY;
        
        switch (direction.toLowerCase()) {
            case 'up':
                startX = width / 2;
                startY = height * (1 - distance);
                endX = width / 2;
                endY = height * distance;
                break;
            case 'down':
                startX = width / 2;
                startY = height * distance;
                endX = width / 2;
                endY = height * (1 - distance);
                break;
            case 'left':
                startX = width * (1 - distance);
                startY = height / 2;
                endX = width * distance;
                endY = height / 2;
                break;
            case 'right':
                startX = width * distance;
                startY = height / 2;
                endX = width * (1 - distance);
                endY = height / 2;
                break;
            default:
                throw new Error(`Dirección no válida: ${direction}`);
        }
        
        await driver.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 1000 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);
    }

    /**
     * Scroll hasta encontrar elemento
     */
    static async scrollToElement(selector, maxScrolls = 10) {
        for (let i = 0; i < maxScrolls; i++) {
            try {
                const element = await $(selector);
                if (await element.isDisplayed()) {
                    return element;
                }
            } catch (error) {
                // Elemento no encontrado, continuar scrolling
            }
            
            // Scroll hacia abajo
            await this.swipe('up', 0.3);
            await driver.pause(1000);
        }
        
        throw new Error(`Elemento ${selector} no encontrado después de ${maxScrolls} scrolls`);
    }

    /**
     * Manejar permisos nativos
     */
    static async handlePermissionAlert(action = 'accept') {
        try {
            // Esperar por el alert de permisos
            await driver.waitUntil(async () => {
                const alert = await driver.getAlertText();
                return alert !== null;
            }, { timeout: 5000 });
            
            if (action === 'accept') {
                await driver.acceptAlert();
            } else {
                await driver.dismissAlert();
            }
        } catch (error) {
            console.log('No se encontró alert de permisos');
        }
    }

    /**
     * Obtener información del dispositivo
     */
    static async getDeviceInfo() {
        const capabilities = await driver.capabilities;
        return {
            platform: capabilities.platformName,
            version: capabilities.platformVersion,
            device: capabilities.deviceName,
            app: capabilities.app,
            udid: capabilities.udid
        };
    }

    /**
     * Tomar screenshot con metadata
     */
    static async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const deviceInfo = await this.getDeviceInfo();
        const filename = `evidence/screenshots/${deviceInfo.platform}-${name}-${timestamp}.png`;
        
        await driver.saveScreenshot(filename);
        console.log(`📸 Screenshot guardado: ${filename}`);
        return filename;
    }

    /**
     * Esperar por carga de aplicación
     */
    static async waitForAppToLoad(timeout = 30000) {
        await driver.waitUntil(async () => {
            const state = await driver.queryAppState('com.example.app'); // Cambiar por tu bundle ID
            return state === 4; // App running in foreground
        }, { timeout });
    }

    /**
     * Reiniciar aplicación
     */
    static async restartApp() {
        await driver.terminateApp('com.example.app'); // Cambiar por tu bundle ID
        await driver.activateApp('com.example.app');
        await this.waitForAppToLoad();
    }

    /**
     * Verificar si elemento existe sin esperar
     */
    static async elementExists(selector) {
        try {
            const element = await $(selector);
            return await element.isExisting();
        } catch (error) {
            return false;
        }
    }

    /**
     * Introducir texto de manera más confiable
     */
    static async typeText(selector, text, clearFirst = true) {
        const element = await $(selector);
        await element.waitForDisplayed();
        
        if (clearFirst) {
            await element.clearValue();
        }
        
        await element.setValue(text);
        
        // Verificar que el texto se introdujo correctamente
        const actualText = await element.getValue();
        if (actualText !== text) {
            console.warn(`Texto esperado: "${text}", texto actual: "${actualText}"`);
        }
    }

    /**
     * Esperar por cambio de pantalla/contexto
     */
    static async waitForScreenChange(timeout = 10000) {
        const initialSource = await driver.getPageSource();
        
        await driver.waitUntil(async () => {
            const currentSource = await driver.getPageSource();
            return currentSource !== initialSource;
        }, { timeout });
    }

    /**
     * Manejar teclado virtual
     */
    static async hideKeyboard() {
        try {
            if (await driver.isKeyboardShown()) {
                await driver.hideKeyboard();
            }
        } catch (error) {
            console.log('No se pudo ocultar el teclado o no está visible');
        }
    }

    /**
     * Obtener texto de múltiples elementos
     */
    static async getElementsText(selector) {
        const elements = await $$(selector);
        const texts = [];
        
        for (const element of elements) {
            texts.push(await element.getText());
        }
        
        return texts;
    }

    /**
     * Long press en elemento
     */
    static async longPress(selector, duration = 2000) {
        const element = await $(selector);
        await element.waitForDisplayed();
        
        const location = await element.getLocation();
        const size = await element.getSize();
        
        const centerX = location.x + (size.width / 2);
        const centerY = location.y + (size.height / 2);
        
        await driver.touchAction([
            { action: 'press', x: centerX, y: centerY },
            { action: 'wait', ms: duration },
            { action: 'release' }
        ]);
    }

    /**
     * Generar datos de prueba para móviles
     */
    static generateMobileTestData() {
        const timestamp = Date.now();
        return {
            phoneNumber: `+1555${String(timestamp).slice(-7)}`,
            email: `mobile${timestamp}@test.com`,
            username: `mobileuser${timestamp}`,
            deviceId: `device_${timestamp}`,
        };
    }
}

module.exports = AppiumHelpers; 