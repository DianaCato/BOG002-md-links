const mdLinks = require("../src/index.js");
const dirname = "C:/Users/DELL/Documents/BOG002/BOG002-md-links";

describe("mdLinks", () => {
  test("mdLinks es una función", () => {
    expect(typeof mdLinks.mdLinks).toBe("function")
  })
  test("mdLinks retorna una promesa", () => {
    const md = mdLinks.mdLinks;
    expect(md(__dirname) instanceof Promise).toBeTruthy();
  })
  test("Arroja error cuando no se ingresa una ruta", () => {
    expect.assertions(1);
    return mdLinks.mdLinks().catch(e => expect(e.message).toMatch("No ingreso ninguna ruta"));
  });
  test("Error cuando no encuentra la ruta", () => {
    return mdLinks.mdLinks("../ruta").catch(e => expect(e.message).toMatch("La ruta no existe"));
  });
  test("Error cuando la carpeta no contiene archivos .md", () => {
    return mdLinks.mdLinks(__dirname).catch(e => expect(e.message).toMatch("La ruta no contiene archivos markdown"));
  });
  test("Error cuando el archivo ingresado no es .md", () => {
    return mdLinks.mdLinks(__filename).catch(e => expect(e.message).toMatch("La ruta no es de un archivo markdown"));
  });
  test("La promesa se resuelve en un array con los datos de los links", () => {
    return expect(typeof mdLinks.mdLinks("./ReadmeTest")).toBe("object");
  });
  test("Se resuelve con un array de objetos cuando el archivo contiene links", () => {
    expect.assertions(1);
    return expect(mdLinks.mdLinks("./ReadmeTest/ReadmeTest.md")).resolves.toStrictEqual([{
      "file": "./ReadmeTest/ReadmeTest.md",
      "href": "https://es.wikipedia.org/wiki/Markdown",
      "text": "Markdown"
    },
    {
      "file": "./ReadmeTest/ReadmeTest.md",
      "href": "https://BUiAdamdrOys6lEB1ewDN8/Prototipo?node-id=0%3A1",
      "text": "Archivo fail con 404",
    },
    {
      "file": "./ReadmeTest/ReadmeTest.md",
      "href": "https://findtheinvisiblecow.com/meow",
      "text": "Archivo con error",
    }]);
  });
  test("Salta archivos node_modules", () => {
    expect.assertions(1);
    return expect(mdLinks.mdLinks(dirname)).resolves.toBeDefined()
  });
});

describe("mdLinks { validate: true }",() =>{
  test("Validate true resuelve un array de objetos que contiene la data de los links", () => {
    return mdLinks.mdLinks("C:/Users/DELL/Documents/BOG002/BOG002-cipher/src", { validate: true }).then(r =>{
expect(r).toBeDefined();
    });
  })
  test("El status incluye 'ok' o 'fail' segun la respuesta http", () => {
    expect.assertions(1);
    return expect(mdLinks.mdLinks("./ReadmeTest/ReadmeTest.md", { validate: true })).resolves.toStrictEqual([{
      "file": "./ReadmeTest/ReadmeTest.md",
      "href": "https://es.wikipedia.org/wiki/Markdown",
      "ok": "Ok",
      "status": 200,
      "text": "Markdown"
    },
    {
      "file": "./ReadmeTest/ReadmeTest.md",
      "href": "https://BUiAdamdrOys6lEB1ewDN8/Prototipo?node-id=0%3A1",
      "ok": "Fail",
      "status": 404,
      "text": "Archivo fail co",
    },
    {
      "file": "./ReadmeTest/ReadmeTest.md",
      "href": "https://findtheinvisiblecow.com/meow",
      "ok": "Fail",
      "status": 403,
      "text": "Archivo con err",
    }]);
  });
  test("Validate true resuelve con un mensaje si no encuentra archivos .md", () => {
     return mdLinks.mdLinks(__dirname, {validate:true}).catch(e => expect(e.message).toMatch("La ruta no contiene archivos markdown"));
  })
})
