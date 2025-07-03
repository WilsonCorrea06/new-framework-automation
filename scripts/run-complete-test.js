#!/usr/bin/env node

/**
 * Script de automatización completa para pruebas móviles
 * Maneja el ciclo completo: inicio de emulador, Appium, pruebas y limpieza
 */

const { spawn, exec } = require('child_process');
const path = require('path');

class MobileTestAutomation {
    constructor() {
        this.appiumProcess = null;
        this.emulatorProcess = null;
        this.isCleaningUp = false;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().slice(11, 19);
        const emoji = {
            'info': 'ℹ️',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'start': '🚀',
            'stop': '🛑'
        };
        console.log(`[${timestamp}] ${emoji[type] || 'ℹ️'} ${message}`);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async executeCommand(command, description) {
        return new Promise((resolve, reject) => {
            this.log(`Ejecutando: ${description}...`, 'start');
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    this.log(`Error en ${description}: ${error.message}`, 'error');
                    reject(error);
                } else {
                    this.log(`${description} completado`, 'success');
                    resolve(stdout);
                }
            });
        });
    }

    async checkEmulatorStatus() {
        try {
            const result = await this.executeCommand('adb devices', 'Verificar dispositivos conectados');
            return result.includes('emulator-') && result.includes('device');
        } catch (error) {
            return false;
        }
    }

    async startEmulator() {
        this.log('Iniciando emulador Pixel 6...', 'start');
        
        return new Promise((resolve, reject) => {
            const emulatorPath = process.env.ANDROID_HOME + '/emulator/emulator';
            this.emulatorProcess = spawn(emulatorPath, ['-avd', 'Pixel_6', '-no-snapshot'], {
                stdio: 'pipe'
            });

            this.emulatorProcess.stdout.on('data', (data) => {
                if (data.toString().includes('Boot completed')) {
                    this.log('Emulador iniciado exitosamente', 'success');
                    resolve();
                }
            });

            this.emulatorProcess.on('error', (error) => {
                this.log(`Error al iniciar emulador: ${error.message}`, 'error');
                reject(error);
            });

            // Timeout de 2 minutos para el inicio
            setTimeout(async () => {
                if (await this.checkEmulatorStatus()) {
                    this.log('Emulador detectado como activo', 'success');
                    resolve();
                } else {
                    this.log('Timeout esperando inicio del emulador', 'error');
                    reject(new Error('Emulator startup timeout'));
                }
            }, 120000);
        });
    }

    async startAppium() {
        this.log('Iniciando servidor Appium...', 'start');
        
        return new Promise((resolve, reject) => {
            this.appiumProcess = spawn('npx', ['appium', 'server'], {
                stdio: 'pipe',
                cwd: process.cwd()
            });

            this.appiumProcess.stdout.on('data', (data) => {
                if (data.toString().includes('Appium REST http interface listener started')) {
                    this.log('Servidor Appium iniciado exitosamente', 'success');
                    resolve();
                }
            });

            this.appiumProcess.on('error', (error) => {
                this.log(`Error al iniciar Appium: ${error.message}`, 'error');
                reject(error);
            });

            // Timeout de 30 segundos para Appium
            setTimeout(() => {
                this.log('Appium iniciado (timeout)', 'warning');
                resolve(); // Continuar aunque no veamos el mensaje
            }, 30000);
        });
    }

    async runTests(testType = 'demo:login') {
        this.log(`Ejecutando pruebas: ${testType}`, 'start');
        
        return new Promise((resolve, reject) => {
            const testProcess = spawn('npm', ['run', testType], {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            testProcess.on('close', (code) => {
                if (code === 0) {
                    this.log('Pruebas completadas exitosamente', 'success');
                    resolve();
                } else {
                    this.log(`Pruebas terminaron con código: ${code}`, 'warning');
                    resolve(); // Continuar con limpieza aunque las pruebas fallen
                }
            });

            testProcess.on('error', (error) => {
                this.log(`Error ejecutando pruebas: ${error.message}`, 'error');
                resolve(); // Continuar con limpieza
            });
        });
    }

    async cleanup() {
        if (this.isCleaningUp) return;
        this.isCleaningUp = true;

        this.log('Iniciando limpieza automática...', 'stop');

        // Detener proceso de pruebas si está corriendo
        try {
            await this.executeCommand('pkill -f "npm run"', 'Detener procesos de pruebas');
        } catch (error) {
            // Ignorar errores
        }

        // Detener Appium
        if (this.appiumProcess) {
            this.log('Deteniendo servidor Appium...', 'stop');
            this.appiumProcess.kill('SIGTERM');
        }
        
        try {
            await this.executeCommand('pkill -f appium', 'Detener procesos Appium restantes');
        } catch (error) {
            // Ignorar errores
        }

        // Detener emulador limpiamente
        try {
            await this.executeCommand('adb emu kill', 'Cerrar emulador via ADB');
            await this.sleep(3000);
        } catch (error) {
            this.log('Intentando detener emulador con pkill...', 'warning');
        }

        // Forzar cierre del emulador si es necesario
        if (this.emulatorProcess) {
            this.log('Deteniendo proceso del emulador...', 'stop');
            this.emulatorProcess.kill('SIGTERM');
        }

        try {
            await this.executeCommand('pkill -f emulator', 'Detener procesos emulador restantes');
        } catch (error) {
            // Ignorar errores
        }

        this.log('Limpieza automática completada', 'success');
    }

    async run(testType = 'demo:login') {
        try {
            // Configurar limpieza en caso de interrupción
            process.on('SIGINT', () => {
                this.log('Interrupción detectada, limpiando...', 'warning');
                this.cleanup().then(() => process.exit(0));
            });

            process.on('SIGTERM', () => {
                this.log('Terminación detectada, limpiando...', 'warning');
                this.cleanup().then(() => process.exit(0));
            });

            // Verificar si ya hay emulador corriendo
            const emulatorRunning = await this.checkEmulatorStatus();
            
            if (!emulatorRunning) {
                await this.startEmulator();
                await this.sleep(10000); // Esperar estabilización
            } else {
                this.log('Emulador ya está corriendo', 'info');
            }

            // Iniciar Appium
            await this.startAppium();
            await this.sleep(5000); // Esperar estabilización

            // Ejecutar pruebas
            await this.runTests(testType);

            // Limpieza automática
            await this.cleanup();

            this.log('🎯 Automatización completa finalizada exitosamente', 'success');

        } catch (error) {
            this.log(`Error en automatización: ${error.message}`, 'error');
            await this.cleanup();
            process.exit(1);
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const testType = process.argv[2] || 'demo:login';
    const automation = new MobileTestAutomation();
    automation.run(testType);
}

module.exports = MobileTestAutomation; 