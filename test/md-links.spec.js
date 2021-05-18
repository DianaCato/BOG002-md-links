const mdLinks = require("../index.js");
const DetectPath = require("../api.js");

describe("mdLinks", () => {
  test("mdLinks es una función", () => {
    expect(typeof mdLinks.mdLinks).toBe("function")
  })
})

describe("DetectPath", () => {
  test("DetectPath es una función", () => {
    expect(typeof DetectPath.DetectPath).toBe("function")
  })

  test("DetectPath identifica cuando una ruta no existe", () => {
   
    //expect(DetectPath.DetectPath("./data")).resolves.toBe("Ruta no encontrada")
  })
})

