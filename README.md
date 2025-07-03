# New Framework Automation

## 📋 Descripción del Proyecto

Framework de automatización profesional diseñado para testing multiplataforma, incluyendo aplicaciones móviles (iOS/Android) y web. Este framework está estructurado siguiendo las mejores prácticas de la industria para garantizar escalabilidad, mantenibilidad y reutilización de código.

## 🏗️ Arquitectura del Framework

```
new-framework-automation/
├── src/                          # Código fuente principal
│   ├── core/                     # Núcleo del framework
│   │   ├── drivers/              # Drivers de dispositivos/navegadores
│   │   └── managers/             # Gestores de sesiones y recursos
│   ├── features/                 # Funcionalidades organizadas por plataforma
│   │   ├── mobile/               # Tests móviles
│   │   │   ├── ios/              # Tests específicos de iOS
│   │   │   └── android/          # Tests específicos de Android
│   │   └── web/                  # Tests web
│   ├── business-logic/           # Reglas de negocio
│   ├── hooks/                    # Hooks del framework
│   ├── patterns/                 # Patrones de diseño
│   └── utils/                    # Utilidades generales
├── config/                       # Configuraciones
│   ├── environments/             # Configuraciones por ambiente
│   └── devices/                  # Configuraciones de dispositivos
├── tests/                        # Organización de pruebas
│   ├── unit/                     # Tests unitarios
│   ├── integration/              # Tests de integración
│   └── e2e/                      # Tests end-to-end
├── reports/                      # Reportes de ejecución
│   ├── html/                     # Reportes HTML
│   ├── json/                     # Reportes JSON
│   └── xml/                      # Reportes XML
├── logs/                         # Sistema de logging
│   ├── execution/                # Logs de ejecución
│   ├── debug/                    # Logs de debug
│   └── error/                    # Logs de errores
├── evidence/                     # Evidencias de pruebas
│   ├── screenshots/              # Capturas de pantalla
│   └── videos/                   # Videos de pruebas
├── .github/                      # CI/CD con GitHub Actions
│   └── workflows/                # Workflows de automatización
├── docs/                         # Documentación
│   ├── api/                      # Documentación de API
│   └── user-guide/               # Guías de usuario
├── scripts/                      # Scripts de utilidad
│   ├── setup/                    # Scripts de configuración
│   └── deployment/               # Scripts de despliegue
└── README.md                     # Documentación principal
```

## 📁 Descripción de Directorios

### 🎯 `/src` - Código Fuente
- **`core/`**: Contiene el núcleo del framework con drivers y gestores
- **`features/`**: Tests organizados por plataforma (móvil/web)
- **`business-logic/`**: Lógica de negocio y reglas específicas
- **`hooks/`**: Hooks para eventos del framework
- **`patterns/`**: Implementación de patrones de diseño
- **`utils/`**: Utilidades y helpers generales

### ⚙️ `/config` - Configuraciones
- **`environments/`**: Configuraciones específicas por ambiente (dev, staging, prod)
- **`devices/`**: Configuraciones de dispositivos móviles y navegadores

### 🧪 `/tests` - Pruebas
- **`unit/`**: Pruebas unitarias
- **`integration/`**: Pruebas de integración
- **`e2e/`**: Pruebas end-to-end

### 📊 `/reports` - Reportes
- **`html/`**: Reportes en formato HTML
- **`json/`**: Reportes en formato JSON
- **`xml/`**: Reportes en formato XML

### 📝 `/logs` - Logging
- **`execution/`**: Logs de ejecución de pruebas
- **`debug/`**: Logs de debug y desarrollo
- **`error/`**: Logs de errores y excepciones

### 📸 `/evidence` - Evidencias
- **`screenshots/`**: Capturas de pantalla automáticas
- **`videos/`**: Grabaciones de pruebas

### 🔄 `/.github` - CI/CD
- **`workflows/`**: Configuraciones de GitHub Actions

### 📚 `/docs` - Documentación
- **`api/`**: Documentación técnica de APIs
- **`user-guide/`**: Guías para usuarios finales

### 🛠️ `/scripts` - Scripts
- **`setup/`**: Scripts de configuración inicial
- **`deployment/`**: Scripts de despliegue

## 🚀 Características Principales

- ✅ **Playwright Integrado**: Framework moderno de automatización web
- ✅ **Appium Integrado**: Pruebas nativas para iOS y Android
- ✅ **Multiplataforma Completa**: Web, iOS nativo, Android nativo
- ✅ **Multi-navegador**: Chrome, Firefox, Safari, Edge
- ✅ **Dispositivos Reales**: Soporte para dispositivos físicos y emuladores
- ✅ **Arquitectura Híbrida**: Web (Playwright) + Nativo (Appium)
- ✅ **Reportes Unificados**: HTML, JSON, JUnit XML, Allure
- ✅ **Evidencias Automáticas**: Screenshots, videos, traces
- ✅ **CI/CD Ready**: GitHub Actions pre-configurado
- ✅ **Logging Avanzado**: Sistema de logs categorizado
- ✅ **Configuración Flexible**: Múltiples ambientes y dispositivos
- ✅ **TypeScript + JavaScript**: Soporte para ambos lenguajes

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Git

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd new-framework-automation

# Instalar dependencias (Playwright + Appium)
npm install

# Instalar navegadores de Playwright
npx playwright install

# Instalar drivers de Appium para móviles
npm run setup:appium

# Instalar dependencias del sistema (opcional)
npx playwright install-deps

# Ejecutar script de configuración inicial
npm run setup
```

### 🔐 Configuración de Credenciales

**IMPORTANTE:** Tus credenciales QA ya están integradas de forma segura.

```bash
# 1. Copiar template de variables de entorno
cp env.example .env

# 2. Las credenciales QA ya están configuradas:
# QA_PHONE_NUMBER=2542542589
# QA_PASSWORD=Wc123456!

# 3. Verificar configuración
npm run check:credentials
```

### Configuración de Ambientes
```bash
# El ambiente QA está configurado por defecto
# TEST_ENVIRONMENT=qa (ya configurado)

# Para otros ambientes, edita .env:
# DEV_PHONE_NUMBER=tu_numero_dev
# PROD_PHONE_NUMBER=tu_numero_prod
```

### Configuración Móvil Nativa

#### Para Android:
```bash
# Instalar Android SDK y configurar ANDROID_HOME
# Habilitar USB Debugging en el dispositivo
# Conectar dispositivo o iniciar emulador

# Verificar conexión
adb devices

# ✅ APK ya configurado: apps/android/app-debug.apk (4.5MB)
# Auto-detección de package y activity habilitada
```

#### Para iOS:
```bash
# Instalar Xcode y Xcode Command Line Tools
# Configurar certificados de desarrollo (para dispositivos reales)

# Colocar tu app en: apps/ios/MyApp.app
# Configurar bundle ID en config/wdio.ios.conf.js
```

## 🏃‍♂️ Uso Básico

### Ejecutar Pruebas

#### Pruebas Web (Playwright)
```bash
# Ejecutar todas las pruebas web
npm test

# Ejecutar con interfaz visual
npm run test:ui

# Ejecutar en modo debug
npm run test:debug

# Ejecutar con navegador visible
npm run test:headed

# Ejecutar por navegador específico
npm run test:chrome
npm run test:firefox
npm run test:safari
```

#### Pruebas Nativas (Appium)
```bash
# Verificar credenciales QA
npm run check:credentials

# Iniciar servidor Appium (terminal separado)
npm run start:appium

# 🎯 PRUEBAS DE LOGIN CON CREDENCIALES REALES
npm run test:login    # Prueba de login automatizada
npm run demo:login    # Demostración completa con evidencias

# 🧹 NUEVOS: Comandos con limpieza automática
npm run clean:demo    # Demo con limpieza automática de emulador
npm run clean:login   # Login con limpieza automática de emulador

# 🚀 AUTOMATIZACIÓN COMPLETA (emulador + pruebas + limpieza)
npm run auto:demo     # Demo completa automatizada
npm run auto:login    # Login completo automatizado
npm run auto:test     # Pruebas completas automatizadas

# Inspección de app real
npm run test:real-app

# Ejecutar pruebas iOS nativas
npm run test:native:ios
```

#### Pruebas Híbridas
```bash
# Ejecutar pruebas web móviles (Playwright)
npm run test:ios     # Emulación web iOS
npm run test:android # Emulación web Android

# Seguido de pruebas nativas (Appium)
npm run test:native:ios
npm run test:native:android
```

### Generar y Ver Reportes
```bash
# Ver último reporte HTML
npm run test:report

# Abrir reporte en navegador
npm run report:open

# Generar código automático
npm run codegen
```

### Desarrollo y Debug
```bash
# Generar tests automáticamente
npx playwright codegen https://example.com

# Ejecutar test específico
npx playwright test tests/e2e/web/example.spec.ts

# Ver trace de una prueba
npx playwright show-trace evidence/trace.zip
```

## 📋 Próximos Pasos

1. **✅ Instalar Playwright + Appium** y configurar navegadores/dispositivos
2. **✅ Configurar ambientes** (dev, staging, prod)
3. **✅ Aplicación Android configurada** (APK: `apps/android/app-debug.apk`)
4. **Desarrollar Page Objects** para web y screens para móviles
5. **Crear test suites híbridos** (web + nativo)
6. **Configurar CI/CD** con dispositivos móviles en la nube
7. **Integrar reportes unificados** (web + móvil)
8. **Añadir tests de API** con Playwright
9. **Configurar tests visuales** para regresión de UI
10. **Implementar pruebas cross-platform** (misma funcionalidad en web/móvil)

## 🎯 Comandos Útiles

### Playwright (Web)
```bash
# Actualizar navegadores
npx playwright install

# Ejecutar tests con filtros
npx playwright test --grep="login"

# Ejecutar solo tests fallidos
npx playwright test --last-failed

# Generar test desde grabación
npx playwright codegen --target typescript
```

### Appium (Nativo)
```bash
# Ver dispositivos conectados
adb devices  # Android
xcrun simctl list  # iOS

# Inspeccionar elementos (Android)
npx appium inspector

# Ver logs del dispositivo
adb logcat  # Android
xcrun simctl spawn booted log stream  # iOS

# Instalar/desinstalar app
adb install apps/android/app-debug.apk
adb uninstall com.example.app
```

### Herramientas de Debug
```bash
# Inspector de Appium
npx @appium/inspector

# Información del dispositivo
adb shell getprop ro.build.version.release  # Android
xcrun simctl list devices  # iOS

# Capturar screenshot manual
adb exec-out screencap -p > screenshot.png  # Android
xcrun simctl io booted screenshot screenshot.png  # iOS
```

## 🧹 Sistema de Limpieza Automática

### Hooks de Limpieza Inteligente

El framework incluye un sistema avanzado de hooks que **automáticamente detiene el emulador y procesos Appium** después de cada ejecución de pruebas:

#### ✅ **Características del Sistema:**
- **Limpieza automática post-pruebas**: Emulador y Appium se detienen automáticamente
- **Verificación pre-pruebas**: Detecta y limpia procesos previos antes de iniciar
- **Manejo de interrupciones**: Limpieza automática con `Ctrl+C`
- **Timeouts inteligentes**: Evita procesos colgados con timeouts de 30 segundos
- **Limpieza de emergencia**: Forzar cierre si la limpieza normal falla
- **Logs detallados**: Seguimiento completo del proceso de limpieza

#### 🎯 **Comandos con Limpieza Automática:**
```bash
# Estos comandos incluyen limpieza automática integrada
npm run clean:demo    # Demo + limpieza automática
npm run clean:login   # Login + limpieza automática

# Verificar que no hay procesos corriendo
ps aux | grep -E "(appium|emulator)"
```

#### 🔧 **Configuración de Hooks:**
Los hooks están configurados en `config/hooks/cleanup.hooks.js` y se ejecutan automáticamente:
- **`onPrepare`**: Limpieza pre-pruebas
- **`afterTest`**: Manejo de errores por prueba
- **`after`**: Limpieza post-suite
- **`onComplete`**: Limpieza final completa

#### 📋 **Proceso de Limpieza:**
1. **Detener Appium**: SIGTERM → esperar → SIGKILL si necesario
2. **Cerrar Emulador**: `adb emu kill` → pkill si necesario
3. **Limpiar ADB**: `adb kill-server` → `adb start-server`
4. **Verificación**: Confirmar que todos los procesos se detuvieron

¡Ya no necesitas preocuparte por procesos colgados! 🎉

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una branch feature
3. Commit tus cambios
4. Push a la branch
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

*Generado con ❤️ para automatización de pruebas profesional*