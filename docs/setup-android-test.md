# 📱 Configuración para tu Prueba Android Nativa

## 🎯 Tu Prueba Está Lista

Hemos configurado una prueba nativa Android específica para:
- ✅ **Dispositivo**: Pixel 5 emulado
- ✅ **Esperas implícitas**: 30 segundos configuradas
- ✅ **Verificaciones**: Inicio de app + botón "Log in" visible

## 🚀 Pasos para Ejecutar

### 1. Preparar tu Aplicación Android

```bash
# Coloca tu APK en la carpeta correcta
cp /ruta/a/tu/app.apk apps/android/app-debug.apk
```

### 2. Configurar tu Aplicación

Edita el archivo `config/wdio.android.conf.js` y actualiza:

```javascript
// Líneas 25-27 - Cambiar por los datos de tu app
'appium:appPackage': 'com.tuapp.package',     // Package name de tu app
'appium:appActivity': '.MainActivity',         // Activity principal
```

### 3. Iniciar el Emulador Android

```bash
# Opción 1: Usar Android Studio
# Abre Android Studio > AVD Manager > Start emulator

# Opción 2: Línea de comandos (si tienes emulador configurado)
emulator -avd Pixel_5_API_30

# Verificar que el dispositivo está conectado
adb devices
```

### 4. Ejecutar la Prueba

```bash
# Terminal 1: Iniciar servidor Appium
npm run start:appium

# Terminal 2: Ejecutar la prueba (en nueva terminal)
npm run test:native:android
```

## 📋 Qué Hace la Prueba

### Test 1: Verificación de Inicio
- ✅ Configura esperas implícitas de 30 segundos
- ✅ Verifica que la aplicación se inicie correctamente
- ✅ Busca elementos principales de la app
- ✅ Toma screenshot del estado inicial
- ✅ Verifica información del dispositivo

### Test 2: Verificación del Botón Log in
- ✅ Busca el botón "Log in" usando múltiples estrategias:
  - Accessibility ID (`~login-button`)
  - Texto exacto ("Log in")
  - Texto parcial (contiene "log")
  - Clase Button con texto relacionado
- ✅ Verifica que el botón esté visible
- ✅ Verifica que el botón esté habilitado
- ✅ Toma screenshot como evidencia

## 🔧 Personalizar para tu App

### Cambiar Selectores del Botón Log in

En `src/features/mobile/android/app-launch.native.spec.js`, línea 65:

```javascript
// Si tu botón tiene un accessibility ID específico
loginButton = await $('~tu-login-button-id');

// Si tu botón tiene texto diferente
loginButton = await $('android=new UiSelector().text("Sign In")');

// Si tu botón tiene un ID específico
loginButton = await $('#com.tuapp:id/login_btn');
```

### Cambiar Elemento Principal de la App

En la línea 35:

```javascript
// Si tu app tiene un título específico
appElement = await $('~tu-app-title');

// Si tu app tiene un texto específico
appElement = await $('android=new UiSelector().textContains("Tu App Name")');
```

## 📸 Evidencias

Los screenshots se guardan automáticamente en:
- `evidence/screenshots/pixel5-app-launch.png`
- `evidence/screenshots/pixel5-login-button-visible.png`

## 🚨 Troubleshooting

### Error: No se encuentra la app
```bash
# Verificar que el APK existe
ls -la apps/android/app-debug.apk

# Verificar package name
aapt dump badging apps/android/app-debug.apk | grep package
```

### Error: Dispositivo no encontrado
```bash
# Verificar dispositivos conectados
adb devices

# Reiniciar ADB si es necesario
adb kill-server
adb start-server
```

### Error: Elemento no encontrado
1. Usar Appium Inspector para encontrar selectores correctos
2. Verificar que la app esté completamente cargada
3. Ajustar los selectores en el test

## ✅ Comando Final

Una vez configurado todo:

```bash
# En una terminal
npm run start:appium

# En otra terminal  
npm run test:native:android
```

**¡Tu prueba Android nativa está lista para ejecutar!** 🎉 

## Tu APK está listo ✅
Ya tienes tu APK en: `/apps/android/app-debug.apk`

## Pasos para Ejecutar las Pruebas

### 1. Instalar Android SDK
```bash
# Si no tienes Android Studio, instala command line tools
# Descarga desde: https://developer.android.com/studio#command-tools
```

### 2. Configurar Variables de Entorno
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 3. Crear Emulador Pixel 5
```bash
# Crear AVD Pixel 5
avdmanager create avd -n Pixel_5_API_30 -k "system-images;android-30;google_apis;x86_64" -d "pixel_5"

# Iniciar emulador
emulator -avd Pixel_5_API_30
```

### 4. Verificar Dispositivo Conectado
```bash
adb devices
# Debería mostrar tu emulador o dispositivo físico
```

### 5. Ejecutar la Prueba con tu APK
```bash
# Asegúrate de que Appium esté corriendo
npm run start:appium

# En otra terminal, ejecuta la prueba
npm run test:android:pixel5
```

## Configuración Actual

### APK Configurado
- **Archivo:** `apps/android/app-debug.apk`
- **Tamaño:** ~4.5MB
- **Auto-detección:** Appium detectará automáticamente el package y activity principal

### Dispositivo de Prueba
- **Emulador:** Pixel 5 (API 30)
- **Plataforma:** Android 11
- **Resolución:** 1080x2340

### Pruebas Incluidas
1. **Lanzamiento de App:** Verifica que la app se inicie correctamente
2. **Botón Log in:** Encuentra y verifica el botón de login
3. **Screenshots:** Captura evidencia automáticamente

## Solución de Problemas

### Si la prueba no encuentra el botón "Log in"
La prueba usa múltiples estrategias de búsqueda:
1. Por accessibility ID: `~login-button`
2. Por texto: botones que contengan "log" (case insensitive)
3. Por clase y texto: Button con texto "Log"

### Si necesitas configurar manualmente el package
Edita `config/wdio.android.conf.js` y descomenta:
```javascript
'appium:appPackage': 'com.tu.app.package', // Cambiar por tu package real
'appium:appActivity': '.MainActivity',      // Cambiar por tu activity principal
```

### Para obtener información de tu APK
```bash
# Instalar aapt (Android Asset Packaging Tool)
# Luego ejecutar:
aapt dump badging apps/android/app-debug.apk | grep package
```

## Comandos Útiles

```bash
# Ver logs en tiempo real
adb logcat

# Instalar APK manualmente
adb install apps/android/app-debug.apk

# Desinstalar app
adb uninstall com.tu.app.package

# Tomar screenshot
adb shell screencap -p /sdcard/screenshot.png
``` 