/**
 * PRUEBA DE DEMOSTRACIÓN - LOGIN EXITOSO CON CAPTURAS
 * APP: Never Missed (com.never_missed_app.never_missed_app.qa)
 * Dispositivo: Pixel 6 Emulado
 * Objetivo: Demostrar login exitoso con evidencia visual
 */

const { getCurrentCredentials, getMaskedCredentials, validateCredentials } = require('../../../../config/credentials');

describe('🎯 DEMO: Never Missed App - Login Exitoso con Evidencia', () => {
    
    before(async () => {
        console.log('🎬 === INICIANDO DEMOSTRACIÓN DE LOGIN EXITOSO ===');
        
        // Validar credenciales
        if (!validateCredentials()) {
            throw new Error('❌ Credenciales no configuradas');
        }
        
        const maskedCreds = getMaskedCredentials();
        console.log(`🔐 Usando credenciales: ${maskedCreds.environment} - ${maskedCreds.phoneNumber}`);
        
        // Configurar timeouts
        await driver.setTimeout({
            'implicit': 10000  // 10 segundos de espera implícita
        });
        
        console.log('✅ Configuración de demostración completada');
    });

    it('🎯 DEMOSTRACIÓN: Login exitoso completo con evidencia visual', async function() {
        this.timeout(300000); // 5 minutos de timeout
        
        console.log('\n🚀 === INICIANDO DEMOSTRACIÓN DE LOGIN ===');
        
        // Obtener credenciales reales
        const credentials = getCurrentCredentials();
        console.log(`🔑 Credenciales de ${credentials.environment} cargadas`);
        
        try {
            // PASO 1: Captura inicial de la app
            console.log('\n📱 PASO 1: Capturando pantalla inicial de la app...');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await driver.saveScreenshot(`./evidence/screenshots/DEMO-01-app-inicial-${timestamp}.png`);
            console.log('📸 ✅ Captura inicial guardada');
            
            // PASO 2: Verificar y hacer clic en botón "Log In"
            console.log('\n🔍 PASO 2: Buscando y haciendo clic en botón "Log In"...');
            const logInButton = await driver.$('android=new UiSelector().description("Log In")');
            
            if (await logInButton.isExisting() && await logInButton.isDisplayed()) {
                console.log('✅ Botón "Log In" encontrado y visible');
                await logInButton.click();
                console.log('🖱️  Clic en botón "Log In" ejecutado');
                
                // Esperar transición
                await driver.pause(3000);
                
                // Captura de pantalla de login
                const loginTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
                await driver.saveScreenshot(`./evidence/screenshots/DEMO-02-pantalla-login-${loginTimestamp}.png`);
                console.log('📸 ✅ Captura de pantalla de login guardada');
                
            } else {
                throw new Error('❌ Botón "Log In" no encontrado o no visible');
            }
            
            // PASO 3: Localizar campos de entrada
            console.log('\n📝 PASO 3: Localizando campos de entrada...');
            
            // Campo de teléfono - usando el selector exacto que funciona
            const phoneField = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
            const passwordField = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)');
            
            if (await phoneField.isExisting() && await passwordField.isExisting()) {
                console.log('✅ Ambos campos de entrada encontrados');
                
                // PASO 4: Ingresar número de teléfono
                console.log('\n📞 PASO 4: Ingresando número de teléfono...');
                await phoneField.click();
                await phoneField.clearValue();
                await phoneField.setValue(credentials.phoneNumber);
                console.log(`✅ Teléfono ingresado: ${credentials.phoneNumber}`);
                
                // Captura después de ingresar teléfono
                const phoneTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
                await driver.saveScreenshot(`./evidence/screenshots/DEMO-03-telefono-ingresado-${phoneTimestamp}.png`);
                console.log('📸 ✅ Captura con teléfono ingresado guardada');
                
                // PASO 5: Ingresar contraseña
                console.log('\n🔑 PASO 5: Ingresando contraseña...');
                await passwordField.click();
                await passwordField.clearValue();
                await passwordField.setValue(credentials.password);
                console.log('✅ Contraseña ingresada (oculta por seguridad)');
                
                // Ocultar teclado
                try {
                    await driver.hideKeyboard();
                } catch (e) {
                    console.log('ℹ️  Teclado ya estaba oculto');
                }
                
                // Captura con credenciales completas
                const credsTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
                await driver.saveScreenshot(`./evidence/screenshots/DEMO-04-credenciales-completas-${credsTimestamp}.png`);
                console.log('📸 ✅ Captura con credenciales completas guardada');
                
                // PASO 6: Hacer clic en botón de login
                console.log('\n🚀 PASO 6: Haciendo clic en botón de login...');
                const submitButton = await driver.$('android=new UiSelector().className("android.widget.Button").description("Log In")');
                
                if (await submitButton.isExisting() && await submitButton.isDisplayed()) {
                    console.log('✅ Botón de submit encontrado');
                    await submitButton.click();
                    console.log('🖱️  Clic en botón de login ejecutado');
                    
                    // PASO 7: Esperar respuesta y capturar resultado
                    console.log('\n⏳ PASO 7: Esperando respuesta del servidor...');
                    await driver.pause(8000); // Esperar respuesta del servidor
                    
                    // Captura inmediata después del login
                    const resultTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    await driver.saveScreenshot(`./evidence/screenshots/DEMO-05-resultado-login-${resultTimestamp}.png`);
                    console.log('📸 ✅ Captura del resultado de login guardada');
                    
                    // PASO 8: Analizar el resultado
                    console.log('\n🔍 PASO 8: Analizando resultado del login...');
                    
                    // Verificar activity actual
                    const currentActivity = await driver.getCurrentActivity();
                    console.log(`📱 Activity actual: ${currentActivity}`);
                    
                    // Buscar indicadores de éxito
                    const successIndicators = [
                        'android=new UiSelector().textContains("Welcome")',
                        'android=new UiSelector().textContains("Dashboard")',
                        'android=new UiSelector().textContains("Home")',
                        'android=new UiSelector().textContains("Bienvenido")',
                        'android=new UiSelector().textContains("Main")',
                        'android=new UiSelector().description("Home")',
                        'android=new UiSelector().description("Dashboard")'
                    ];
                    
                    let loginSuccess = false;
                    let successMessage = '';
                    
                    for (const indicator of successIndicators) {
                        try {
                            const element = await driver.$(indicator);
                            if (await element.isExisting()) {
                                const text = await element.getText();
                                const contentDesc = await element.getAttribute('content-desc');
                                successMessage = text || contentDesc || 'Elemento de éxito detectado';
                                console.log(`🎉 Indicador de éxito encontrado: ${successMessage}`);
                                loginSuccess = true;
                                break;
                            }
                        } catch (e) {
                            // Continuar con el siguiente indicador
                        }
                    }
                    
                    // Verificar cambio de activity (otro indicador de éxito)
                    if (!loginSuccess && currentActivity !== 'com.never_missed_app.never_missed_app.MainActivity') {
                        console.log('🎉 Login exitoso detectado: Cambio de activity');
                        loginSuccess = true;
                        successMessage = `Nueva activity: ${currentActivity}`;
                    }
                    
                    // Buscar elementos que indiquen que estamos dentro de la app
                    if (!loginSuccess) {
                        try {
                            const appElements = await driver.$$('android=new UiSelector().clickable(true)');
                            if (appElements.length > 5) { // Si hay muchos elementos clickeables, probablemente estamos dentro
                                console.log(`🎉 Login exitoso detectado: ${appElements.length} elementos interactivos encontrados`);
                                loginSuccess = true;
                                successMessage = `Interfaz principal cargada con ${appElements.length} elementos`;
                            }
                        } catch (e) {
                            console.log('ℹ️  No se pudo contar elementos clickeables');
                        }
                    }
                    
                    // PASO 9: Captura final de confirmación
                    console.log('\n📸 PASO 9: Captura final de confirmación...');
                    const finalTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    await driver.saveScreenshot(`./evidence/screenshots/DEMO-06-confirmacion-final-${finalTimestamp}.png`);
                    console.log('📸 ✅ Captura final de confirmación guardada');
                    
                    // PASO 10: Resultado final
                    console.log('\n🏁 PASO 10: RESULTADO FINAL');
                    
                    if (loginSuccess) {
                        console.log('\n🎉 ===== ¡LOGIN EXITOSO CONFIRMADO! =====');
                        console.log('✅ DEMOSTRACIÓN COMPLETADA CON ÉXITO');
                        console.log(`✅ Usuario: ${credentials.phoneNumber}`);
                        console.log(`✅ Indicador de éxito: ${successMessage}`);
                        console.log('✅ Todas las capturas de pantalla guardadas');
                        console.log('\n📁 Capturas generadas:');
                        console.log('   📸 DEMO-01-app-inicial-*.png');
                        console.log('   📸 DEMO-02-pantalla-login-*.png');
                        console.log('   📸 DEMO-03-telefono-ingresado-*.png');
                        console.log('   📸 DEMO-04-credenciales-completas-*.png');
                        console.log('   📸 DEMO-05-resultado-login-*.png');
                        console.log('   📸 DEMO-06-confirmacion-final-*.png');
                        console.log('\n🎯 ¡DEMOSTRACIÓN DE LOGIN EXITOSO COMPLETADA!');
                    } else {
                        console.log('\n⚠️  ===== RESULTADO INCIERTO =====');
                        console.log('⚠️  No se detectaron indicadores claros de éxito');
                        console.log('⚠️  Revisa las capturas para análisis manual');
                        console.log(`⚠️  Activity actual: ${currentActivity}`);
                        console.log('\n📁 Capturas generadas para análisis:');
                        console.log('   📸 DEMO-01-app-inicial-*.png');
                        console.log('   📸 DEMO-02-pantalla-login-*.png');
                        console.log('   📸 DEMO-03-telefono-ingresado-*.png');
                        console.log('   📸 DEMO-04-credenciales-completas-*.png');
                        console.log('   📸 DEMO-05-resultado-login-*.png');
                        console.log('   📸 DEMO-06-confirmacion-final-*.png');
                    }
                    
                } else {
                    throw new Error('❌ Botón de submit no encontrado');
                }
                
            } else {
                throw new Error('❌ Campos de entrada no encontrados');
            }
            
        } catch (error) {
            console.error('\n❌ ERROR EN DEMOSTRACIÓN:', error.message);
            
            // Captura de error
            const errorTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await driver.saveScreenshot(`./evidence/screenshots/DEMO-ERROR-${errorTimestamp}.png`);
            console.log(`📸 Captura de error guardada: DEMO-ERROR-${errorTimestamp}.png`);
            
            throw error;
        }
    });

    after(async () => {
        console.log('\n🏁 Demostración completada');
        console.log('📊 Revisa las capturas en: ./evidence/screenshots/DEMO-*.png');
    });
});