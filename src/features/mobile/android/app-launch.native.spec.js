/**
 * Prueba Nativa Android - Inspección Completa de Never Missed App
 * APP: Never Missed (com.never_missed_app.never_missed_app.qa)
 * Dispositivo: Pixel 6 Emulado
 * Objetivo: Inspección exhaustiva de elementos UI reales
 */

// Las variables globales están disponibles automáticamente en WebDriverIO
// expect, $, $$, driver están disponibles globalmente

describe('Android Pixel 6 - Never Missed App Inspección Completa', () => {
    
    before(async () => {
        console.log('📱 Configurando inspección completa para Never Missed App...');
        
        // Configurar esperas implícitas
        await driver.setTimeout({
            'implicit': 10000  // 10 segundos de espera implícita
        });
        
        console.log('🔧 Configuración completada');
    });

    it('🔍 Debe inspeccionar TODOS los elementos UI de Never Missed App', async function() {
        this.timeout(120000); // 2 minutos de timeout
        
        console.log('🚀 Iniciando inspección exhaustiva de UI...');
        
        // 1. Información básica de la sesión
        try {
            console.log('📱 Activity actual:', await driver.execute('mobile: getCurrentActivity'));
            console.log('📱 Orientación:', await driver.getOrientation());
        } catch (e) {
            console.log('⚠️ Error obteniendo información básica:', e.message);
        }
        
        // 2. Buscar TODOS los tipos de elementos
        const elementTypes = [
            'android.widget.TextView',
            'android.widget.Button', 
            'android.widget.EditText',
            'android.widget.ImageView',
            'android.widget.ImageButton',
            'android.view.View',
            'android.widget.LinearLayout',
            'android.widget.RelativeLayout',
            'android.widget.FrameLayout',
            'android.widget.ScrollView',
            'android.webkit.WebView',
            'android.widget.ListView',
            'android.widget.RecyclerView'
        ];
        
        console.log('🔍 Buscando elementos por tipo de clase...');
        for (const elementType of elementTypes) {
            try {
                const elements = await driver.$$(`android=${elementType}`);
                console.log(`📝 ${elementType}: ${elements.length} elementos encontrados`);
                
                // Si encontramos elementos, obtener información adicional
                if (elements.length > 0) {
                    for (let i = 0; i < Math.min(elements.length, 3); i++) {
                        try {
                            const text = await elements[i].getText();
                            const isDisplayed = await elements[i].isDisplayed();
                            const bounds = await elements[i].getRect();
                            console.log(`  └─ Elemento ${i+1}: "${text || 'Sin texto'}" | Visible: ${isDisplayed} | Posición: ${bounds.x},${bounds.y}`);
                        } catch (e) {
                            console.log(`  └─ Elemento ${i+1}: Error obteniendo detalles`);
                        }
                    }
                }
            } catch (error) {
                console.log(`❌ Error buscando ${elementType}: ${error.message}`);
            }
        }
        
        // 3. Buscar por selectores más específicos
        console.log('🔍 Buscando elementos clickeables...');
        try {
            const clickableElements = await driver.$$('android=new UiSelector().clickable(true)');
            console.log(`🖱️ Elementos clickeables: ${clickableElements.length}`);
            
            for (let i = 0; i < Math.min(clickableElements.length, 5); i++) {
                try {
                    const text = await clickableElements[i].getText();
                    const contentDesc = await clickableElements[i].getAttribute('content-desc');
                    const resourceId = await clickableElements[i].getAttribute('resource-id');
                    console.log(`  └─ Clickeable ${i+1}: "${text || contentDesc || resourceId || 'Sin identificador'}"`);
                } catch (e) {
                    console.log(`  └─ Clickeable ${i+1}: Error obteniendo detalles`);
                }
            }
        } catch (error) {
            console.log(`❌ Error buscando elementos clickeables: ${error.message}`);
        }
        
        // 4. Obtener el source completo de la página
        console.log('📄 Obteniendo source de la página...');
        try {
            const pageSource = await driver.getPageSource();
            console.log(`📄 Longitud del source: ${pageSource.length} caracteres`);
            
            // Buscar elementos específicos en el source
            const webViewCount = (pageSource.match(/WebView/g) || []).length;
            const buttonCount = (pageSource.match(/Button/g) || []).length;
            const textViewCount = (pageSource.match(/TextView/g) || []).length;
            const viewCount = (pageSource.match(/android\.view\.View/g) || []).length;
            const layoutCount = (pageSource.match(/Layout/g) || []).length;
            
            console.log(`📊 Análisis del source:`);
            console.log(`  └─ WebViews encontrados: ${webViewCount}`);
            console.log(`  └─ Botones encontrados: ${buttonCount}`);
            console.log(`  └─ TextViews encontrados: ${textViewCount}`);
            console.log(`  └─ Views encontrados: ${viewCount}`);
            console.log(`  └─ Layouts encontrados: ${layoutCount}`);
            
        } catch (error) {
            console.log(`❌ Error obteniendo page source: ${error.message}`);
        }
        
        // 5. Buscar elementos por texto específico
        console.log('🔍 Buscando elementos por texto común...');
        const commonTexts = ['Login', 'Sign in', 'Welcome', 'Home', 'Menu', 'Settings', 'Start', 'Continue', 'Next', 'OK'];
        for (const text of commonTexts) {
            try {
                const elements = await driver.$$(`android=new UiSelector().textContains("${text}")`);
                if (elements.length > 0) {
                    console.log(`📝 Elementos con texto "${text}": ${elements.length}`);
                }
            } catch (e) {
                // Silenciosamente ignorar errores
            }
        }
        
        // 6. Captura final
        console.log('📸 Tomando screenshot final...');
        await driver.saveScreenshot(`evidence/screenshots/never-missed-inspection-${Date.now()}.png`);
        
        console.log('✅ Inspección completa terminada');
    });

    it('🌐 Debe verificar contextos y capacidades web', async function() {
        this.timeout(60000);
        
        console.log('🌐 Verificando contextos disponibles...');
        const contexts = await driver.getContexts();
        console.log('🌐 Contextos disponibles:', contexts);
        
        // Si hay WebView, intentar cambiar contexto
        const webViewContext = contexts.find(ctx => ctx.includes('WEBVIEW'));
        if (webViewContext) {
            console.log(`🌐 WebView encontrado: ${webViewContext}`);
            try {
                await driver.switchContext(webViewContext);
                console.log('🌐 Cambiado a contexto WebView exitosamente');
                
                // Intentar obtener título de la página web
                const title = await driver.getTitle();
                console.log(`🌐 Título de la página: "${title}"`);
                
                // Volver al contexto nativo
                await driver.switchContext('NATIVE_APP');
                console.log('🌐 Vuelto a contexto nativo');
            } catch (error) {
                console.log(`❌ Error manejando WebView: ${error.message}`);
            }
        } else {
            console.log('🌐 No se encontraron WebViews activos');
        }
        
        console.log('✅ Verificación de contextos completada');
    });

    after(async () => {
        console.log('🏁 Inspección de Never Missed App completada');
    });
});
