import { Page } from '@playwright/test';

/**
 * Utilidades helper para pruebas con Playwright
 */
export class TestHelpers {
  
  /**
   * Generar datos de prueba aleatorios
   */
  static generateTestData() {
    const timestamp = new Date().getTime();
    return {
      email: `test${timestamp}@example.com`,
      username: `user${timestamp}`,
      password: `Pass123${timestamp}`,
      phone: `+1555${String(timestamp).slice(-7)}`,
      randomString: Math.random().toString(36).substring(7),
    };
  }

  /**
   * Esperar y tomar screenshot con timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `evidence/screenshots/${name}-${timestamp}.png`;
    
    await page.screenshot({ 
      path: filename,
      fullPage: true 
    });
    
    return filename;
  }

  /**
   * Scroll suave a un elemento
   */
  static async smoothScrollToElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Esperar animación
  }

  /**
   * Esperar por carga completa de la página
   */
  static async waitForFullPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    
    // Esperar por imágenes y recursos adicionales
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every(img => img.complete);
    });
  }

  /**
   * Verificar si estamos en dispositivo móvil
   */
  static async isMobileDevice(page: Page): Promise<boolean> {
    const viewport = page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  /**
   * Manejar alertas/popups automáticamente
   */
  static async setupAlertHandlers(page: Page): Promise<void> {
    page.on('dialog', async dialog => {
      console.log(`Dialog appeared: ${dialog.type()}: ${dialog.message()}`);
      await dialog.accept();
    });
  }

  /**
   * Obtener información del navegador
   */
  static async getBrowserInfo(page: Page): Promise<any> {
    return await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: screen.width,
          height: screen.height
        },
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
      };
    });
  }

  /**
   * Limpiar inputs antes de escribir
   */
  static async clearAndType(page: Page, selector: string, text: string): Promise<void> {
    await page.fill(selector, ''); // Limpiar primero
    await page.type(selector, text); // Escribir caracteres uno por uno
  }

  /**
   * Esperar por elemento con reintentos
   */
  static async waitForElementWithRetry(
    page: Page, 
    selector: string, 
    maxRetries: number = 3
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        return true;
      } catch (error) {
        console.log(`Intento ${i + 1} fallido para selector: ${selector}`);
        if (i === maxRetries - 1) {
          return false;
        }
        await page.waitForTimeout(1000);
      }
    }
    return false;
  }

  /**
   * Generar reporte de logs de consola
   */
  static setupConsoleLogging(page: Page): void {
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[Browser ${type.toUpperCase()}]: ${text}`);
    });

    page.on('pageerror', error => {
      console.error(`[Page Error]: ${error.message}`);
    });
  }
} 