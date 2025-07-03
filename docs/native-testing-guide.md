# 📱 Guía de Pruebas Nativas - Appium + Playwright

## 🎯 Objetivo

Esta guía te ayudará a ejecutar pruebas nativas en iOS y Android usando **Appium** integrado con nuestro framework **Playwright**. 

## 🏗️ Arquitectura Híbrida

```
┌─────────────────┐    ┌─────────────────┐
│   Playwright    │    │     Appium      │
│   (Web Tests)   │    │ (Native Tests)  │
├─────────────────┤    ├─────────────────┤
│ • Chrome        │    │ • Android Apps  │
│ • Firefox       │    │ • iOS Apps      │
│ • Safari        │    │ • Real Devices  │
│ • Mobile Web    │    │ • Emulators     │
└─────────────────┘    └─────────────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌─────────────────────────┐
        │   Unified Reports       │
        │   • HTML, JSON, XML     │
        │   • Screenshots         │
        │   • Videos & Traces     │
        └─────────────────────────┘
```

## 🔧 Configuración Inicial

### 1. Instalación de Dependencias

```bash
# Instalar framework completo
npm install

# Instalar drivers de Appium
npm run setup:appium

# Verificar instalación
npx appium driver list
```

### 2. Configuración Android

#### Prerrequisitos:
- **Android Studio** instalado
- **Android SDK** configurado
- Variable **ANDROID_HOME** definida
- **USB Debugging** habilitado en dispositivo

#### Verificación:
```bash
# Verificar SDK
echo $ANDROID_HOME

# Ver dispositivos conectados
adb devices

# Verificar versión de ADB
adb version
```

#### Configurar tu aplicación:
1. Coloca tu APK en: `apps/android/app-debug.apk`
2. Edita `config/wdio.android.conf.js`:
   ```javascript
   'appium:appPackage': 'com.tu.app.package',
   'appium:appActivity': '.MainActivity',
   ```

### 3. Configuración iOS

#### Prerrequisitos:
- **Xcode** instalado
- **iOS Simulator** configurado
- **Certificados de desarrollo** (para dispositivos reales)

#### Verificación:
```bash
# Ver simuladores disponibles
xcrun simctl list devices

# Verificar Xcode
xcode-select --print-path
```

#### Configurar tu aplicación:
1. Coloca tu .app en: `apps/ios/MyApp.app`
2. Edita `config/wdio.ios.conf.js`:
   ```javascript
   'appium:bundleId': 'com.tu.app.bundleid',
   'appium:deviceName': 'iPhone 13',
   ```

## 🚀 Ejecutar Pruebas

### Flujo Completo

```bash
# Terminal 1: Iniciar Appium Server
npm run start:appium

# Terminal 2: Ejecutar pruebas Android
npm run test:native:android

# Terminal 3: Ejecutar pruebas iOS
npm run test:native:ios
```

### Desarrollo y Debug

```bash
# Ejecutar con logs detallados
DEBUG=1 npm run test:native:android

# Ejecutar solo un archivo específico
npx wdio run config/wdio.android.conf.js --spec src/features/mobile/android/login.native.spec.js

# Usar Appium Inspector para elementos
npx @appium/inspector
```

## 📝 Escribir Pruebas Nativas

### Estructura de Test

```javascript
const { expect } = require('@wdio/globals');

describe('Mi App - Feature', () => {
    beforeEach(async () => {
        // Setup antes de cada test
        await TestHelpers.restartApp();
    });

    it('Debe realizar acción específica', async () => {
        // 1. Esperar elementos
        const button = await $('~my-button');
        await button.waitForDisplayed();
        
        // 2. Interactuar
        await button.click();
        
        // 3. Verificar resultado
        const result = await $('~result-text');
        await expect(result).toBeDisplayed();
        
        // 4. Capturar evidencia
        await TestHelpers.takeScreenshot('feature-success');
    });
});
```

### Selectores Recomendados

#### Android:
```javascript
// Accessibility ID (recomendado)
await $('~login-button')

// Android UiAutomator
await $('android=new UiSelector().text("Login")')

// XPath
await $('//android.widget.Button[@text="Login"]')

// ID
await $('#com.app:id/login_button')
```

#### iOS:
```javascript
// Accessibility ID (recomendado)
await $('~login-button')

// iOS Predicate String
await $('-ios predicate string:name == "Login"')

// iOS Class Chain
await $('-ios class chain:**/XCUIElementTypeButton[`name == "Login"`]')

// XPath
await $('//XCUIElementTypeButton[@name="Login"]')
```

## 🎨 Mejores Prácticas

### 1. Uso de Accessibility IDs
```javascript
// ✅ Bueno - Multiplataforma
await $('~login-button')

// ❌ Evitar - Específico de plataforma
await $('#com.app:id/login') // Solo Android
await $('//XCUIElementTypeButton') // Solo iOS
```

### 2. Esperas Inteligentes
```javascript
// ✅ Bueno - Esperar condición específica
await element.waitForDisplayed({ timeout: 10000 })

// ❌ Evitar - Esperas fijas
await driver.pause(5000)
```

### 3. Manejo de Errores
```javascript
try {
    await TestHelpers.handlePermissionAlert('accept');
} catch (error) {
    console.log('No hay alert de permisos');
}
```

### 4. Screenshots Contextuales
```javascript
// Tomar screenshot con nombre descriptivo
await TestHelpers.takeScreenshot('login-form-filled');
await TestHelpers.takeScreenshot('payment-success');
```

## 🔍 Debugging y Solución de Problemas

### Problemas Comunes

#### Android:
```bash
# App no inicia
adb logcat | grep -i error

# Permisos
adb shell pm grant com.your.app android.permission.CAMERA

# Reinstalar app
adb uninstall com.your.app
adb install apps/android/app-debug.apk
```

#### iOS:
```bash
# Simulador no responde
xcrun simctl shutdown all
xcrun simctl erase all

# Verificar logs
xcrun simctl spawn booted log stream --predicate 'process == "YourApp"'

# Reinstalar app
xcrun simctl uninstall booted com.your.app
xcrun simctl install booted apps/ios/MyApp.app
```

### Herramientas de Inspección

#### Appium Inspector:
```bash
# Iniciar inspector
npx @appium/inspector

# Configuración de conexión:
# Remote Host: localhost
# Remote Port: 4723
# Remote Path: /
```

#### UiAutomator Viewer (Android):
```bash
# Generar dump de UI
adb exec-out uiautomator dump /dev/tty
```

## 📊 Reportes y Evidencias

### Configuración de Reportes

Los reportes se generan automáticamente en:
- **HTML**: `reports/allure-results/`
- **JUnit**: `reports/junit/`
- **Screenshots**: `evidence/screenshots/`

### Ver Reportes

```bash
# Instalar Allure (una vez)
npm install -g allure-commandline

# Generar y abrir reporte Allure
allure generate reports/allure-results --clean
allure open allure-report
```

## 🌐 Integración con CI/CD

### GitHub Actions

```yaml
- name: Setup Android Environment
  run: |
    echo "ANDROID_HOME=$ANDROID_SDK_ROOT" >> $GITHUB_ENV
    $ANDROID_SDK_ROOT/tools/bin/sdkmanager "platform-tools"

- name: Start Emulator
  run: |
    $ANDROID_SDK_ROOT/emulator/emulator -avd test -no-audio -no-window &

- name: Run Native Tests
  run: |
    npm run start:appium &
    npm run test:native:android
```

## 📚 Recursos Adicionales

- [Documentación oficial de Appium](http://appium.io/docs/)
- [WebDriverIO Documentation](https://webdriver.io/)
- [Android UI Testing](https://developer.android.com/training/testing/ui-testing)
- [iOS UI Testing](https://developer.apple.com/documentation/xctest/user_interface_tests)

## 🆘 Soporte

Si encuentras problemas:

1. **Verifica logs**: Revisa logs de Appium y dispositivo
2. **Inspecciona elementos**: Usa Appium Inspector
3. **Prueba manualmente**: Verifica que la acción funcione manualmente
4. **Revisa configuración**: Valida capabilities y configuraciones
5. **Comunidad**: Busca en GitHub Issues del proyecto

---

*¡Listo para hacer pruebas nativas profesionales! 🚀* 