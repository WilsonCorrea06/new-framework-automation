import { test, expect } from '@playwright/test';

/**
 * Suite de pruebas de ejemplo para Web
 * Demuestra el uso del framework con Playwright
 */
test.describe('Pruebas Web - Ejemplo', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configuración antes de cada test
    await page.goto('/');
  });

  test('Debe cargar la página principal correctamente', async ({ page }) => {
    // Verificar que la página cargue correctamente
    await expect(page).toHaveTitle(/Example/);
    
    // Tomar screenshot de evidencia
    await page.screenshot({ 
      path: 'evidence/screenshots/homepage-load.png',
      fullPage: true 
    });
  });

  test('Debe permitir navegación básica', async ({ page }) => {
    // Simular navegación
    const aboutLink = page.locator('a[href="/about"]');
    
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*about/);
    }
    
    // Evidencia de navegación
    await page.screenshot({ 
      path: 'evidence/screenshots/navigation-test.png' 
    });
  });

  test('Debe manejar elementos interactivos', async ({ page }) => {
    // Buscar botón o elemento interactivo
    const button = page.locator('button, input[type="submit"], .btn');
    
    if (await button.first().isVisible()) {
      await button.first().click();
      
      // Esperar por cambios en la página
      await page.waitForLoadState('networkidle');
    }
    
    // Capturar evidencia
    await page.screenshot({ 
      path: 'evidence/screenshots/interaction-test.png' 
    });
  });

  test('Debe validar formularios básicos', async ({ page }) => {
    // Buscar campos de formulario
    const nameInput = page.locator('input[name="name"], input[type="text"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Usuario Test');
    }
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    
    // Screenshot del formulario completado
    await page.screenshot({ 
      path: 'evidence/screenshots/form-validation.png' 
    });
  });
}); 