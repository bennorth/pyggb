import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 960,
        height: 720,
        deviceScaleFactor: 1,
    });

    await page.goto("https://geogebra.org/python/index.html?name=Simple+program+with+error&code=eJzjKjBUsFUIyM%2FMK9Ew1lEw0eQqMIIL6BrqKOgaa3Jlg9T4ZOalahQARQqMNLm4CopACpQ8UnNy8nUUyvOLclIUleDiefnxxaXJGfFliUWZiUk5qZoAgMsd1Q%3D%3D");

    await page.waitForSelector("div.ErrorReport");

    await page.screenshot({path: "gui-summary.png"});

    await browser.close();
})();
