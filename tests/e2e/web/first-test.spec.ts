import { test, expect } from '@playwright/test';

/**
 * Tu Primera Prueba - Ejemplo Práctico
 * Esta prueba funcionará inmediatamente y te mostrará las capacidades del framework
 */
test.describe('Mi Primera Prueba con Playwright', () => {

  test('Debe navegar a Google y realizar una búsqueda', async ({ page }) => {
    console.log('🚀 Iniciando mi primera prueba...');
    
    // 1. Navegar a Google
    await page.goto('https://www.google.com');
    
    // 2. Aceptar cookies si aparece el banner
    try {
      const acceptButton = page.locator('button:has-text("Aceptar todo"), button:has-text("I agree"), button:has-text("Accept all")');
      await acceptButton.click({ timeout: 3000 });
      console.log('✅ Cookies aceptadas');
    } catch (error) {
      console.log('ℹ️ No hay banner de cookies o ya fue aceptado');
    }
    
    // 3. Verificar que estamos en Google
    await expect(page).toHaveTitle(/Google/);
    console.log('✅ Página de Google cargada correctamente');
    
    // 4. Buscar el campo de búsqueda y escribir
    const searchBox = page.locator('input[name="q"]');
    await searchBox.fill('Playwright automation testing');
    console.log('✅ Texto ingresado en búsqueda');
    
    // 5. Presionar Enter para buscar
    await searchBox.press('Enter');
    
    // 6. Esperar a que carguen los resultados
    await page.waitForSelector('div#search', { timeout: 10000 });
    console.log('✅ Resultados de búsqueda cargados');
    
    // 7. Verificar que hay resultados
    const results = page.locator('div#search h3');
    await expect(results.first()).toBeVisible();
    
    // 8. Contar resultados encontrados
    const resultCount = await results.count();
    console.log(`✅ Se encontraron ${resultCount} resultados`);
    
    // 9. Verificar que algún resultado contiene "Playwright"
    const firstResultText = await results.first().textContent();
    expect(firstResultText?.toLowerCase()).toContain('playwright');
    console.log('✅ Los resultados son relevantes a "Playwright"');
    
    // 10. Tomar screenshot de evidencia
    await page.screenshot({ 
      path: 'evidence/screenshots/my-first-test-success.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como evidencia');
    
    console.log('🎉 ¡Primera prueba completada exitosamente!');
  });

  test('Debe probar la navegación básica en una página', async ({ page }) => {
    console.log('🔗 Probando navegación básica...');
    
    // 1. Ir a la página de ejemplo de Playwright
    await page.goto('https://playwright.dev/');
    
    // 2. Verificar título
    await expect(page).toHaveTitle(/Playwright/);
    
    // 3. Hacer clic en "Docs"
    await page.click('a:has-text("Docs")');
    
    // 4. Verificar que navegamos a la documentación
    await expect(page.url()).toContain('/docs');
    
    // 5. Buscar elemento específico de la página de docs
    const gettingStarted = page.locator('text=Getting started');
    await expect(gettingStarted).toBeVisible();
    
    // 6. Screenshot de la página de documentación
    await page.screenshot({ 
      path: 'evidence/screenshots/playwright-docs-navigation.png' 
    });
    
    console.log('✅ Navegación básica funcionando correctamente');
  });

  test('Debe probar formularios básicos', async ({ page }) => {
    console.log('📝 Probando formularios...');
    
    // 1. Ir a una página con formularios de ejemplo
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // 2. Verificar que la página cargó
    await expect(page.locator('h2')).toContainText('Login Page');
    
    // 3. Llenar el formulario
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    
    // 4. Hacer clic en login
    await page.click('button[type="submit"]');
    
    // 5. Verificar login exitoso
    const successMessage = page.locator('.flash.success');
    await expect(successMessage).toContainText('You logged into a secure area!');
    
    // 6. Screenshot de éxito
    await page.screenshot({ 
      path: 'evidence/screenshots/form-login-success.png' 
    });
    
    console.log('✅ Formulario y login funcionando correctamente');
  });

}); 