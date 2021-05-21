const mdLinks = require("../index.js");
const rutaSinLinks = "C:/Users/DELL/Documents/BOG002/BOG002-md-links/ReadmeTest/ReadmeSinLinks.md";
const rutaConLink = "./ReadmeTest/ReadmeTest.md";

describe("mdLinks", () => {
  test("mdLinks es una función", () => {
    expect(typeof mdLinks.mdLinks).toBe("function")
  })
  test("Arroja error cuando no se ingresa una ruta", () => {
    expect.assertions(1);
    return mdLinks.mdLinks().catch(e => expect(e.message).toMatch("No ingreso ninguna ruta"));
  });
  test("Error cuando no encuentra la ruta", () => {
    expect.assertions(1);
    return mdLinks.mdLinks("../ruta").catch(e => expect(e.message).toMatch("La ruta no existe")); 
  });
  test("Error cuando la carpeta no contiene archivos .md", () => {
    expect.assertions(1);
    return expect (mdLinks.mdLinks("./img")).resolves.toBe("La ruta no contiene archivos markdown"); 
  });
  test("Error cuando el archivo ingresado no es .md", () => {
    expect.assertions(1);
    return expect (mdLinks.mdLinks(__filename)).resolves.toBe("La ruta no es de un archivo markdown"); 
  });
  test("Retorna un array con los datos de los links", () => {
    return expect (typeof mdLinks.mdLinks("./ReadmeTest")).toBe("object"); 
  });
  test("Error cuando el archivo no contiene links", () => {
    expect.assertions(1);
    return expect (mdLinks.mdLinks('./ReadmeTest/ReadmeSinLinks.md')).resolves.toBe("El archivo ./ReadmeTest/ReadmeSinLinks.md no contiene links"); 
  });
  test("Se resuelve con un array de objetos cuando el archivo contiene links", () => {
    expect.assertions(1);
    return expect (mdLinks.mdLinks("./ReadmeTest/ReadmeTest.md")).resolves.toStrictEqual([{"file": "./ReadmeTest/ReadmeTest.md", 
                                                                          "href": "https://es.wikipedia.org/wiki/Markdown", 
                                                                          "text": "Markdown"}]); 
  });
  test("Salta archivos node_modules", () => {
    return expect ( mdLinks.mdLinks(__dirname)).resolves.toBeDefined()
  });
  
  
})


