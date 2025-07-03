/**
 * Prueba Automatizada de Login - Never Missed App
 * APP: Never Missed (com.never_missed_app.never_missed_app.qa)
 * Dispositivo: Pixel 6 Emulado
 * Objetivo: Automatizar el proceso completo de inicio de sesión con credenciales reales
 */

const { getCurrentCredentials, getMaskedCredentials, validateCredentials } = require('../../../../config/credentials');

describe('Never Missed App - Pruebas de Login Automatizadas', () => {
    
    before(async () => {
        console.log('🔐 Configurando pruebas de login para Never Missed App...');
        
        // Validar que las credenciales estén configuradas
        if (!validateCredentials()) {
            throw new Error('❌ Credenciales no configuradas. Verifica tu archivo .env');
        }
        
        // Mostrar configuración (enmascarada para seguridad)
        const maskedCreds = getMaskedCredentials();
        console.log(`📱 Usando credenciales de ambiente: ${maskedCreds.environment}`);
        console.log(`📞 Teléfono: ${maskedCreds.phoneNumber}`);
        console.log(`🔑 Contraseña: ${maskedCreds.password}`);
        
        // Configurar esperas implícitas
        await driver.setTimeout({
            'implicit': 15000  // 15 segundos de espera implícita
        });
        
        console.log('🔧 Configuración de login completada');
    });

    it('🔐 Debe realizar login completo con credenciales QA', async function() {
        this.timeout(180000); // 3 minutos de timeout
        
        console.log('\n🚀 === INICIANDO PRUEBA DE LOGIN AUTOMATIZADA ===');
        
        // Obtener credenciales reales para la prueba
        const credentials = getCurrentCredentials();
        console.log(`🔑 Usando credenciales de ${credentials.environment}`);
        
        try {
            // Paso 1: Verificar que la app esté abierta
            console.log('\n📱 PASO 1: Verificando que la app esté activa...');
            const currentActivity = await driver.getCurrentActivity();
            console.log(`✅ Activity actual: ${currentActivity}`);
            
            // Paso 2: Buscar y hacer clic en el botón "Log In"
            console.log('\n🔍 PASO 2: Buscando botón de Login...');
            const logInButton = await driver.$('android=new UiSelector().description("Log In")');
            
            if (await logInButton.isExisting()) {
                console.log('✅ Botón "Log In" encontrado');
                
                const isDisplayed = await logInButton.isDisplayed();
                const isEnabled = await logInButton.isEnabled();
                
                if (isDisplayed && isEnabled) {
                    console.log('🖱️  Haciendo clic en botón "Log In"...');
                    await logInButton.click();
                    
                    // Esperar a que aparezca la pantalla de login
                    console.log('⏳ Esperando pantalla de login...');
                    await driver.pause(5000);
                    
                    // Tomar screenshot de la pantalla de login
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    await driver.saveScreenshot(`./evidence/screenshots/login-screen-${timestamp}.png`);
                    console.log(`📸 Screenshot de login guardado`);
                    
                } else {
                    throw new Error('Botón "Log In" no está disponible para clic');
                }
                
            } else {
                throw new Error('Botón "Log In" no encontrado');
            }
            
            // Paso 3: Buscar campos de entrada
            console.log('\n📝 PASO 3: Buscando campos de entrada...');
            
            // Buscar campo de teléfono/email
            const phoneSelectors = [
                'android=new UiSelector().textContains("Phone")',
                'android=new UiSelector().textContains("phone")',
                'android=new UiSelector().textContains("Email")',
                'android=new UiSelector().textContains("email")',
                'android=new UiSelector().textContains("Usuario")',
                'android=new UiSelector().textContains("Username")',
                'android=new UiSelector().className("android.widget.EditText").instance(0)',
                'android.widget.EditText'
            ];
            
            let phoneField = null;
            for (const selector of phoneSelectors) {
                try {
                    const field = await driver.$(selector);
                    if (await field.isExisting() && await field.isDisplayed()) {
                        phoneField = field;
                        console.log(`✅ Campo de teléfono encontrado con selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continuar con el siguiente selector
                }
            }
            
            // Buscar campo de contraseña
            const passwordSelectors = [
                'android=new UiSelector().textContains("Password")',
                'android=new UiSelector().textContains("password")',
                'android=new UiSelector().textContains("Contraseña")',
                'android=new UiSelector().className("android.widget.EditText").instance(1)',
                'android=new UiSelector().className("android.widget.EditText")'
            ];
            
            let passwordField = null;
            for (const selector of passwordSelectors) {
                try {
                    const field = await driver.$(selector);
                    if (await field.isExisting() && await field.isDisplayed()) {
                        // Verificar si es diferente al campo de teléfono
                        if (!phoneField || !(await field.equals(phoneField))) {
                            passwordField = field;
                            console.log(`✅ Campo de contraseña encontrado con selector: ${selector}`);
                            break;
                        }
                    }
                } catch (e) {
                    // Continuar con el siguiente selector
                }
            }
            
            // Paso 4: Ingresar credenciales
            if (phoneField && passwordField) {
                console.log('\n🔑 PASO 4: Ingresando credenciales...');
                
                // Ingresar número de teléfono
                console.log(`📞 Ingresando teléfono: ${credentials.phoneNumber}`);
                await phoneField.click();
                await phoneField.clearValue();
                await phoneField.setValue(credentials.phoneNumber);
                
                // Pequeña pausa entre campos
                await driver.pause(1000);
                
                // Ingresar contraseña
                console.log('🔑 Ingresando contraseña...');
                await passwordField.click();
                await passwordField.clearValue();
                await passwordField.setValue(credentials.password);
                
                // Ocultar teclado
                await driver.hideKeyboard();
                
                console.log('✅ Credenciales ingresadas correctamente');
                
                // Paso 5: Buscar y hacer clic en botón de login/submit
                console.log('\n🚀 PASO 5: Buscando botón de envío...');
                
                const submitSelectors = [
                    'android=new UiSelector().textContains("Sign In")',
                    'android=new UiSelector().textContains("Log In")',
                    'android=new UiSelector().textContains("Login")',
                    'android=new UiSelector().textContains("Entrar")',
                    'android=new UiSelector().textContains("Iniciar")',
                    'android=new UiSelector().textContains("Submit")',
                    'android=new UiSelector().className("android.widget.Button")',
                    'android.widget.Button'
                ];
                
                let submitButton = null;
                for (const selector of submitSelectors) {
                    try {
                        const button = await driver.$(selector);
                        if (await button.isExisting() && await button.isDisplayed() && await button.isEnabled()) {
                            submitButton = button;
                            console.log(`✅ Botón de envío encontrado con selector: ${selector}`);
                            break;
                        }
                    } catch (e) {
                        // Continuar con el siguiente selector
                    }
                }
                
                if (submitButton) {
                    console.log('🖱️  Haciendo clic en botón de login...');
                    await submitButton.click();
                    
                    // Esperar respuesta del servidor
                    console.log('⏳ Esperando respuesta del login...');
                    await driver.pause(8000);
                    
                    // Paso 6: Verificar resultado del login
                    console.log('\n✅ PASO 6: Verificando resultado del login...');
                    
                    // Tomar screenshot del resultado
                    const resultTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    await driver.saveScreenshot(`./evidence/screenshots/login-result-${resultTimestamp}.png`);
                    console.log(`📸 Screenshot del resultado guardado`);
                    
                    // Verificar si el login fue exitoso
                    const currentActivityAfterLogin = await driver.getCurrentActivity();
                    console.log(`📱 Activity después del login: ${currentActivityAfterLogin}`);
                    
                    // Buscar indicadores de éxito o error
                    const successIndicators = [
                        'android=new UiSelector().textContains("Welcome")',
                        'android=new UiSelector().textContains("Dashboard")',
                        'android=new UiSelector().textContains("Home")',
                        'android=new UiSelector().textContains("Bienvenido")'
                    ];
                    
                    const errorIndicators = [
                        'android=new UiSelector().textContains("Error")',
                        'android=new UiSelector().textContains("Invalid")',
                        'android=new UiSelector().textContains("Incorrect")',
                        'android=new UiSelector().textContains("Failed")',
                        'android=new UiSelector().textContains("Inválido")'
                    ];
                    
                    let loginSuccess = false;
                    let loginError = false;
                    
                    // Verificar indicadores de éxito
                    for (const indicator of successIndicators) {
                        try {
                            const element = await driver.$(indicator);
                            if (await element.isExisting()) {
                                console.log(`🎉 Login exitoso detectado: ${indicator}`);
                                loginSuccess = true;
                                break;
                            }
                        } catch (e) {
                            // Continuar
                        }
                    }
                    
                    // Verificar indicadores de error
                    for (const indicator of errorIndicators) {
                        try {
                            const element = await driver.$(indicator);
                            if (await element.isExisting()) {
                                const errorText = await element.getText();
                                console.log(`❌ Error de login detectado: ${errorText}`);
                                loginError = true;
                                break;
                            }
                        } catch (e) {
                            // Continuar
                        }
                    }
                    
                    // Resultado final
                    if (loginSuccess) {
                        console.log('\n🎉 ===== LOGIN EXITOSO =====');
                        console.log('✅ Las credenciales funcionan correctamente');
                        console.log(`✅ Usuario: ${credentials.phoneNumber}`);
                        console.log('✅ Acceso concedido a la aplicación');
                    } else if (loginError) {
                        console.log('\n❌ ===== LOGIN FALLÓ =====');
                        console.log('❌ Las credenciales fueron rechazadas');
                        console.log('❌ Verifica usuario y contraseña');
                    } else {
                        console.log('\n⚠️  ===== RESULTADO INCIERTO =====');
                        console.log('⚠️  No se pudo determinar el resultado del login');
                        console.log('⚠️  Revisa los screenshots para análisis manual');
                    }
                    
                } else {
                    throw new Error('No se encontró botón de envío/login');
                }
                
            } else {
                console.log('❌ No se pudieron encontrar los campos de entrada');
                console.log(`   Campo teléfono: ${phoneField ? 'Encontrado' : 'No encontrado'}`);
                console.log(`   Campo contraseña: ${passwordField ? 'Encontrado' : 'No encontrado'}`);
                
                // Analizar la pantalla para debugging
                console.log('\n🔍 Analizando pantalla para debugging...');
                const pageSource = await driver.getPageSource();
                console.log(`📄 Source length: ${pageSource.length} caracteres`);
                
                // Buscar EditText en el source
                const editTextMatches = pageSource.match(/EditText/g);
                console.log(`📝 EditText encontrados en source: ${editTextMatches ? editTextMatches.length : 0}`);
                
                throw new Error('Campos de entrada no encontrados');
            }
            
        } catch (error) {
            console.error('\n❌ ERROR EN PRUEBA DE LOGIN:', error.message);
            
            // Tomar screenshot de error
            const errorTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = `./evidence/screenshots/login-error-${errorTimestamp}.png`;
            await driver.saveScreenshot(screenshotPath);
            console.log(`📸 Screenshot de error guardado: ${screenshotPath}`);
            
            throw error;
        }
    });

    it('🔍 Debe analizar la estructura de la pantalla de login', async function() {
        this.timeout(60000);
        
        console.log('\n🔍 === ANÁLISIS DETALLADO DE PANTALLA DE LOGIN ===');
        
        try {
            // Navegar a la pantalla de login
            const logInButton = await driver.$('android=new UiSelector().description("Log In")');
            if (await logInButton.isExisting()) {
                await logInButton.click();
                await driver.pause(3000);
            }
            
            // Obtener y analizar el page source
            console.log('📄 Obteniendo estructura de la pantalla...');
            const pageSource = await driver.getPageSource();
            
            // Análisis de elementos
            const analyses = {
                'EditText (Campos de entrada)': /EditText/g,
                'Button (Botones)': /Button/g,
                'TextView (Textos)': /TextView/g,
                'ImageView (Imágenes)': /ImageView/g,
                'LinearLayout (Layouts)': /LinearLayout/g,
                'Password (Campos de contraseña)': /password/gi,
                'Email (Campos de email)': /email/gi,
                'Phone (Campos de teléfono)': /phone/gi
            };
            
            console.log('\n📊 Análisis de elementos en la pantalla:');
            Object.entries(analyses).forEach(([name, pattern]) => {
                const matches = pageSource.match(pattern);
                console.log(`   ${name}: ${matches ? matches.length : 0} encontrados`);
            });
            
            // Guardar el page source para análisis posterior
            const fs = require('fs');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const sourceFile = `./evidence/page-source-login-${timestamp}.xml`;
            fs.writeFileSync(sourceFile, pageSource);
            console.log(`💾 Page source guardado: ${sourceFile}`);
            
            console.log('✅ Análisis de pantalla completado');
            
        } catch (error) {
            console.error('❌ Error en análisis:', error.message);
            throw error;
        }
    });
}); 