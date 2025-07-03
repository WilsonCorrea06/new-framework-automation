import { test, expect } from '@playwright/test';

/**
 * Suite de pruebas de ejemplo para Mobile
 * Demuestra el uso del framework con dispositivos móviles
 */
test.describe('Pruebas Mobile - Ejemplo', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configuración antes de cada test móvil
    await page.goto('/');
  });

  test('Debe adaptarse correctamente a dispositivo móvil', async ({ page }) => {
    // Verificar viewport móvil
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(768); // Típico breakpoint móvil
    
    // Verificar elementos responsive
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, #mobile-menu');
    
    // Tomar screenshot móvil
    await page.screenshot({ 
      path: 'evidence/screenshots/mobile-responsive.png',
      fullPage: true 
    });
  });

  test('Debe manejar gestos táctiles', async ({ page }) => {
    // Simular tap (equivalente a click en móvil)
    const element = page.locator('button, a, [role="button"]').first();
    
    if (await element.isVisible()) {
      await element.tap();
      await page.waitForLoadState('networkidle');
    }
    
    // Evidencia de interacción táctil
    await page.screenshot({ 
      path: 'evidence/screenshots/mobile-tap-interaction.png' 
    });
  });

  test('Debe permitir scroll vertical en móvil', async ({ page }) => {
    // Scroll hacia abajo
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    
    await page.waitForTimeout(1000); // Esperar animación
    
    // Screenshot después del scroll
    await page.screenshot({ 
      path: 'evidence/screenshots/mobile-scroll.png' 
    });
    
    // Verificar que el scroll funcionó
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('Debe manejar formularios en móvil', async ({ page }) => {
    // Buscar campos de input
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    
    if (await inputs.first().isVisible()) {
      // Focus en el primer input
      await inputs.first().focus();
      
      // En móvil, esto podría activar el teclado virtual
      await inputs.first().fill('Texto de prueba móvil');
      
      // Screenshot con teclado virtual (si aplica)
      await page.screenshot({ 
        path: 'evidence/screenshots/mobile-keyboard.png' 
      });
    }
  });

  test('Debe detectar orientación del dispositivo', async ({ page }) => {
    // Obtener orientación actual
    const orientation = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.screen.orientation?.type || 'unknown'
      };
    });
    
    console.log('Orientación detectada:', orientation);
    
    // Verificar que estamos en modo portrait (típico para móvil)
    expect(orientation.height).toBeGreaterThan(orientation.width);
    
    // Screenshot de orientación
    await page.screenshot({ 
      path: 'evidence/screenshots/mobile-orientation.png' 
    });
  });

  test('Debe manejar navegación móvil', async ({ page }) => {
    // Buscar menú hamburguesa o navegación móvil
    const mobileNav = page.locator('[data-testid="hamburger"], .hamburger, .menu-toggle');
    
    if (await mobileNav.isVisible()) {
      await mobileNav.tap();
      
      // Esperar que se abra el menú
      await page.waitForTimeout(500);
      
      // Screenshot del menú abierto
      await page.screenshot({ 
        path: 'evidence/screenshots/mobile-navigation.png' 
      });
    }
  });
}); 