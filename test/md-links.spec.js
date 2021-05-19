const mdLinks = require("../index.js");


describe("mdLinks", () => {
  test("mdLinks es una función", () => {
    expect(typeof mdLinks.mdLinks).toBe("function")
  })
  test("Arroja error cuando no se ingresa una ruta", () => {
    expect.assertions(1);
    return mdLinks.mdLinks().catch(e => expect(e.message).toMatch("No ingreso ninguna ruta"));
  });
  
})


