import { Page, Browser, BrowserContext } from '@playwright/test';

/**
 * Driver base para todas las plataformas
 * Proporciona funcionalidades comunes para web y móvil
 */
export class BaseDriver {
  protected page: Page;
  protected browser: Browser;
  protected context: BrowserContext;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.page = page;
    this.browser = browser!;
    this.context = context!;
  }

  /**
   * Navegar a una URL
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Esperar por un elemento
   */
  async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Hacer click en un elemento
   */
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Escribir texto en un elemento
   */
  async type(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  /**
   * Obtener texto de un elemento
   */
  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  /**
   * Verificar si un elemento está visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  /**
   * Tomar screenshot
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Esperar por navegación
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Ejecutar JavaScript
   */
  async executeScript(script: string): Promise<any> {
    return await this.page.evaluate(script);
  }

  /**
   * Scroll a un elemento
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Cerrar página actual
   */
  async close(): Promise<void> {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }
  }
} 