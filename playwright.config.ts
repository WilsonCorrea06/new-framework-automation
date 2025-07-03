import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Configuración principal de Playwright
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directorio de tests
  testDir: './tests',
  
  // Ejecutar tests en paralelo en archivos
  fullyParallel: true,
  
  // Fallar la build en CI si dejaste test.only
  forbidOnly: !!process.env.CI,
  
  // Reintentos en CI, no localmente
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers en paralelo
  workers: process.env.CI ? 1 : undefined,
  
  // Configuración de reportes
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['junit', { outputFile: 'reports/xml/results.xml' }],
    ['line']
  ],
  
  // Configuración global de tests
  use: {
    // URL base para usar en los tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Capturar trace en retry
    trace: 'on-first-retry',
    
    // Screenshot en fallo
    screenshot: 'only-on-failure',
    
    // Video en retry
    video: 'retain-on-failure',
    
    // Directorio para artefactos
    outputDir: 'evidence/',
  },

  // Configuración de proyectos
  projects: [
    // Navegadores Desktop
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/e2e/web',
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/e2e/web',
    },
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
      testDir: './tests/e2e/web',
    },
    
    // Mobile Chrome
    {
      name: 'android',
      use: { ...devices['Pixel 5'] },
      testDir: './tests/e2e/mobile',
    },
    
    // Mobile Safari
    {
      name: 'ios',
      use: { ...devices['iPhone 12'] },
      testDir: './tests/e2e/mobile',
    },
    
    // Tablets
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
      testDir: './tests/e2e/web',
    },
  ],

  // Web Server (opcional)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
}); 