/**
 * Hooks de limpieza automática para pruebas móviles
 * Maneja el cierre de emuladores y procesos Appium después de las pruebas
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class CleanupHooks {
    constructor() {
        this.isCleaningUp = false;
        this.cleanupTimeout = 30000; // 30 segundos timeout
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().slice(11, 19);
        const emoji = {
            'info': 'ℹ️',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'stop': '🛑'
        };
        console.log(`[${timestamp}] ${emoji[type]} ${message}`);
    }

    async executeCommand(command, description, ignoreErrors = true) {
        try {
            const { stdout, stderr } = await execAsync(command);
            if (stdout.trim()) {
                this.log(`${description}: ${stdout.trim()}`, 'success');
            } else {
                this.log(`${description} completado`, 'success');
            }
            return true;
        } catch (error) {
            if (!ignoreErrors) {
                this.log(`Error en ${description}: ${error.message}`, 'error');
            }
            return false;
        }
    }

    async checkProcessExists(processName) {
        try {
            const { stdout } = await execAsync(`pgrep -f "${processName}"`);
            return stdout.trim().length > 0;
        } catch (error) {
            return false;
        }
    }

    async stopAppiumProcesses() {
        this.log('Deteniendo procesos Appium...', 'stop');
        
        // Verificar si hay procesos Appium corriendo
        const appiumExists = await this.checkProcessExists('appium');
        if (!appiumExists) {
            this.log('No hay procesos Appium activos', 'info');
            return true;
        }

        // Intentar detener Appium con SIGTERM primero
        await this.executeCommand('pkill -TERM -f appium', 'Enviar SIGTERM a Appium');
        
        // Esperar un momento para que se cierre limpiamente
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar si aún está corriendo y forzar cierre si es necesario
        const stillRunning = await this.checkProcessExists('appium');
        if (stillRunning) {
            this.log('Forzando cierre de Appium...', 'warning');
            await this.executeCommand('pkill -KILL -f appium', 'Forzar cierre de Appium');
        }

        return true;
    }

    async stopEmulatorProcesses() {
        this.log('Deteniendo emulador...', 'stop');
        
        // Verificar si hay emulador corriendo
        const emulatorExists = await this.checkProcessExists('emulator');
        if (!emulatorExists) {
            this.log('No hay emulador activo', 'info');
            return true;
        }

        // Intentar cerrar emulador limpiamente con ADB
        const adbSuccess = await this.executeCommand('adb emu kill', 'Cerrar emulador via ADB');
        
        if (adbSuccess) {
            // Esperar que se cierre limpiamente
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Verificar si se cerró
            const stillRunning = await this.checkProcessExists('emulator');
            if (!stillRunning) {
                this.log('Emulador cerrado limpiamente', 'success');
                return true;
            }
        }

        // Si ADB no funcionó, usar pkill
        this.log('Intentando cerrar emulador con pkill...', 'warning');
        await this.executeCommand('pkill -TERM -f emulator', 'Enviar SIGTERM a emulador');
        
        // Esperar un momento
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar si aún está corriendo y forzar cierre si es necesario
        const stillRunning = await this.checkProcessExists('emulator');
        if (stillRunning) {
            this.log('Forzando cierre del emulador...', 'warning');
            await this.executeCommand('pkill -KILL -f emulator', 'Forzar cierre del emulador');
        }

        return true;
    }

    async cleanupAdbConnections() {
        this.log('Limpiando conexiones ADB...', 'info');
        
        // Matar servidor ADB para limpiar conexiones
        await this.executeCommand('adb kill-server', 'Detener servidor ADB');
        
        // Esperar un momento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reiniciar servidor ADB
        await this.executeCommand('adb start-server', 'Reiniciar servidor ADB');
        
        return true;
    }

    async executeCleanup() {
        if (this.isCleaningUp) {
            this.log('Limpieza ya en progreso, ignorando...', 'warning');
            return;
        }

        this.isCleaningUp = true;
        this.log('🛑 Iniciando limpieza automática post-pruebas...', 'stop');

        try {
            // Crear timeout para evitar que la limpieza se cuelgue
            const cleanupPromise = this.performCleanup();
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Cleanup timeout')), this.cleanupTimeout);
            });

            await Promise.race([cleanupPromise, timeoutPromise]);
            
            this.log('🎯 Limpieza automática completada exitosamente', 'success');
            
        } catch (error) {
            this.log(`Error durante limpieza: ${error.message}`, 'error');
            this.log('Intentando limpieza de emergencia...', 'warning');
            await this.emergencyCleanup();
        } finally {
            this.isCleaningUp = false;
        }
    }

    async performCleanup() {
        // Paso 1: Detener procesos Appium
        await this.stopAppiumProcesses();
        
        // Paso 2: Detener emulador
        await this.stopEmulatorProcesses();
        
        // Paso 3: Limpiar conexiones ADB
        await this.cleanupAdbConnections();
        
        // Paso 4: Verificación final
        await this.verifyCleanup();
    }

    async emergencyCleanup() {
        this.log('Ejecutando limpieza de emergencia...', 'warning');
        
        // Forzar cierre de todos los procesos relacionados
        const commands = [
            'pkill -KILL -f appium',
            'pkill -KILL -f emulator',
            'pkill -KILL -f qemu-system',
            'adb kill-server'
        ];

        for (const command of commands) {
            await this.executeCommand(command, `Emergencia: ${command}`);
        }
    }

    async verifyCleanup() {
        this.log('Verificando limpieza...', 'info');
        
        const appiumRunning = await this.checkProcessExists('appium');
        const emulatorRunning = await this.checkProcessExists('emulator');
        
        if (!appiumRunning && !emulatorRunning) {
            this.log('✅ Verificación exitosa: Todos los procesos han sido detenidos', 'success');
        } else {
            if (appiumRunning) this.log('⚠️  Appium aún está corriendo', 'warning');
            if (emulatorRunning) this.log('⚠️  Emulador aún está corriendo', 'warning');
        }
    }

    // Hook para ser llamado cuando se interrumpe la ejecución (Ctrl+C)
    setupInterruptHandler() {
        process.on('SIGINT', () => {
            this.log('Interrupción detectada (Ctrl+C)', 'warning');
            this.executeCleanup().then(() => {
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            this.log('Terminación detectada', 'warning');
            this.executeCleanup().then(() => {
                process.exit(0);
            });
        });
    }

    // Hook para ser llamado antes de iniciar las pruebas
    async beforeTestSuite() {
        this.log('🧹 Verificando estado antes de las pruebas...', 'info');
        
        // Verificar si hay procesos previos corriendo
        const appiumRunning = await this.checkProcessExists('appium');
        const emulatorRunning = await this.checkProcessExists('emulator');
        
        if (appiumRunning || emulatorRunning) {
            this.log('Detectados procesos previos, limpiando...', 'warning');
            await this.executeCleanup();
            
            // Esperar un momento después de la limpieza
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        this.log('✅ Estado limpio para iniciar pruebas', 'success');
    }

    // Hook para ser llamado después de cada prueba individual
    async afterEachTest(test, context, { error, result, duration, passed, retries }) {
        if (error && !passed) {
            // Solo tomar screenshot, no hacer limpieza completa
            this.log(`❌ Prueba falló: ${test.title}`, 'error');
        }
    }

    // Hook para ser llamado después de toda la suite de pruebas
    async afterTestSuite() {
        this.log('🏁 Suite de pruebas completada, iniciando limpieza...', 'info');
        await this.executeCleanup();
    }
}

// Crear instancia singleton
const cleanupHooks = new CleanupHooks();

// Configurar handlers de interrupción automáticamente
cleanupHooks.setupInterruptHandler();

module.exports = cleanupHooks; 