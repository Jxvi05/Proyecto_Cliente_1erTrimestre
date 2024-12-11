///////////////////////////////////////////   Proyecto de Sistema de Gestión Académica de Estudiantes y Asignaturas (SGAEA)   ///////////////////////////////////////////



/*Comenzamos con la clase Dirección, la cual contiene los atributos compuestos por la dirección de cada persona*/
/*En el atributo codPostal nos aseguramos de que tenga 5 numeros del 0 al 9 y en caso de no ser así devolverá 00000*/
/*Tenemos un método para mostrar la dirección en formato legible*/

class Direccion {
  calle;
  numero;
  piso;
  codPostal;
  provincia;
  localidad;

  constructor(calle, numero, piso, codPostal, provincia, localidad) {
    this.calle = calle;
    this.numero = numero;
    this.piso = piso;
    this.codPostal = (new String(codPostal.match(/^[0-9]{5}$/))) ? codPostal : "00000";
    this.provincia = provincia;
    this.localidad = localidad;
  }

  mostrarDireccion() {
    return `${this.calle}, Nº ${this.numero}, Piso ${this.piso}, ${this.localidad}, ${this.provincia}, CP: ${this.codPostal}`;
  }
}

/*
Seguimos con la clase Persona, compuesta por el DNI, el nombre y edad.
Al heredar de la clase Dirección hereda los atributos de la misma mediante el super.
Tiene los getters de cada atributo.
Esta clase tiene también el método mostrarPersona que simplemente muestra los datos de la persona, añadiendo tambien la dirección.
*/


class Persona extends Direccion {
  id;
  nombre;
  edad;

  constructor(id, nombre, edad, direccion) {
    super(direccion.calle, direccion.numero, direccion.piso, direccion.codPostal, direccion.provincia, direccion.localidad);
    this.id = id;
    this.nombre = ((nombre.match(/^[a-zA-ZáéíóúüÁÉÍÓÚÜ ]+$/)) ? nombre : "persona");
    this.edad = edad;
  }

  get getId() {
    return this.id;
  }

  get getNombre() {
    return this.nombre;
  }

  get getEdad() {
    return this.edad;
  }

  mostrarPersona() {
    return `ID: ${this.id}\nNombre: ${this.nombre}\nEdad: ${this.edad}\nDirección: ${super.mostrarDireccion()}`;
  }
}

/*
La clase Estudiante contiene los atributos asignaturas,matriculas y hereda los atributos de la clase Persona al heredar de la misma.
Tiene los siguientes métodos:

matricular: matricula a los estudiantes en una asignatura asignandole una fecha de matriculación, esta última se valida,
haciendo que este en fornato DD/MM/YYYY y que los dias, meses y años esten entre dos valores.

desmatricular: desmatricula un estudiante de una asignatura.

agregarCalificación: agrega una calificación entre 0 y 10 en una asignatura al estudiante que queramos.

calcularPromedioAsignatura: primero se asegura de que la asignatura existe y si existe hace la media utilizando el método reduce, que hace una suma de todas las
calificaciónes de la asignatura y despues se divide entre el numero de calificaciones existentes, este último lo conseguimos con el metodo length. Con el método
toFixed exigimos que haya un máximo de dos decimales.

calcularPromedioGeneral: utilizando el metodo object.values en asignaturas obtenemos los valores de las asignaturas
y con el metodo flat conseguimos aplanar los valores anidados en simples.

mostrarEstudiante: con este método mostramos los datos del estudiante y a parte con el método object.keys y join obtenemos las asignaturas poniendo ", " entre ellas.
*/

class Estudiante extends Persona {
  asignaturas = {};
  matriculas = {};

  constructor(id, nombre, edad, direccion) {
    super(id, nombre, edad, direccion);
    this.asignaturas = {};
    this.matriculas = {};
  }

  get getAsignaturas() {
    return this.asignaturas;
  }

  matricular(asignatura, fecha) {

    const filtroFecha = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = fecha.match(filtroFecha);
  
    if (!match) {
      console.log("Fecha no válida. Debe estar en el formato DD/MM/YYYY.");
      return;
    }
  
    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const anio = parseInt(match[3], 10);
  
    if (dia < 1 || dia > 30 || mes < 1 || mes > 12 || anio < 1 || anio > 2024) {
      console.log("Fecha no válida. Verifica día, mes y/o año.");
      return;
    }
    
    const filtroNombreAsignatura = /^[a-zA-ZIVXLCDM\s]+$/;

    if (filtroNombreAsignatura.test(asignatura)) {
      if (!this.asignaturas[asignatura]) {
        this.asignaturas[asignatura] = [];
        this.matriculas[asignatura] = fecha;
        console.log(`${this.nombre} matriculado en ${asignatura} el ${fecha}`);
      } else {
        console.log(`${this.nombre} ya está matriculado en ${asignatura}`);
      }
    } else {
      console.log("El nombre de la asignatura solo puede contener letras, números romanos (I, V, X, L, C, D, M) y espacios.");
      this.nombre = "Asignatura inválida";
    }
  }

  desmatricular(asignatura) {
    if (this.asignaturas[asignatura]) {
      delete this.asignaturas[asignatura];
      delete this.matriculas[asignatura];
      console.log(`${this.nombre} desmatriculado de ${asignatura}`);
    } else {
      console.log(`${this.nombre} no está matriculado en ${asignatura}`);
    }
  }

  agregarCalificacion(asignatura, calificacion) {
    if (this.asignaturas[asignatura]) {
      if (calificacion >= 0 && calificacion <= 10) {
        this.asignaturas[asignatura].push(calificacion);
        console.log(`Calificación ${calificacion} añadida en ${asignatura}`);
      } else {
        console.log("La calificación debe estar entre 0 y 10.");
      }
    } else {
      console.log(`No está matriculado en la asignatura ${asignatura}`);
    }
  }

  calcularPromedioAsignatura(asignatura) {
    if (this.asignaturas[asignatura] && this.asignaturas[asignatura].length > 0) {
      const calificaciones = this.asignaturas[asignatura];
      const suma = calificaciones.reduce((total, nota) => total + nota, 0);
      return (suma / calificaciones.length).toFixed(2);
    }
    return "No hay calificaciones en esta asignatura."; 
  }

  calcularPromedioGeneral() {
    const todasLasCalificaciones = Object.values(this.asignaturas).flat();
    if (todasLasCalificaciones.length === 0) {
      return "No hay calificaciones.";
    }
    const suma = todasLasCalificaciones.reduce((total, nota) => total + nota, 0);
    return (suma / todasLasCalificaciones.length).toFixed(2);
  }

  mostrarEstudiante() {
    return `${super.mostrarPersona()}\nAsignaturas: ${Object.keys(this.asignaturas).join(', ')}`;
  }
}

/*
La clase Asignatura contiene el atributo nombre y los siguientes métodos:

agregarCalificación: agrega calificaciones entre 0 y 10 a una asignatura en concreto y lo añade al array calificaciones con el método push.

calcularPromedio: este método calcula la media de las calificaciones de una asignatura en concreto, si el array calificaciones esta vacío devuelve 0,
si no con los métodos reduce y toFixed previamente explicados en la clase Estdiante hace una la media.
*/

class Asignatura {
  nombre;

  constructor(nombre) {
    const filtro = /^[a-zA-ZIVXLCDM\s]+$/;

    if (filtro.test(nombre)) {
      this.nombre = nombre;
    } else {
      console.log("El nombre de la asignatura solo puede contener letras, números romanos (I, V, X, L, C, D, M) y espacios.");
      this.nombre = "Asignatura inválida";
    }
    this.calificaciones = [];
  }

  agregarCalificacion(calificacion) {
    if (calificacion >= 0 && calificacion <= 10) {
      this.calificaciones.push(calificacion);
    } else {
      console.log("La calificación debe estar entre 0 y 10.");
    }
  }

  calcularPromedio() {
    if (this.calificaciones.length === 0) return 0;
    const suma = this.calificaciones.reduce((total, nota) => total + nota, 0);
    return (suma / this.calificaciones.length).toFixed(2);
  }
}

/*
Esta última clase esta compuesta por el atributo estudiantes.
Contiene los siguientes métodos:

agregarEstudiante: si el id del estudiante no coincide con otro id ya existente  (esto lo hacemos con el método some, que verifica si al
menos un elemento del array cumple con la condición) lo añade a estudiantes mediante el método push.

eliminarEstudiante: empezamos buscando el índice del estudiante que queramos eliminar
usando el metodo findIndex, que devuelve el índice del elemento que cumple con la condición pasada al método,
en caso de no encontrarlo devuelve -1. Después una vez sepamos el índice del estudiante a eliminar, con el método splice
eliminamos al estudiante del array estudiantes.

listarEstudiantes: recorre el array estudiante con el método foreach y por cada estudiante llamamos a la funcion mostrarEstudiante de dicho estudiante.

generarReporte: recorre el array de estudiantes con el método foreach y por cada estudiante llamamos a la función mostrarEstudiante de dicho estudiante
y además recorremos el array asignaturas del estudiante y por cada asignatura utilizamos el método calcularPromedioAsignatura para mostrar
cada asignatura y el promedio de cada una.
*/

class SistemaGestionAcademica {
  estudiantes = [];

  constructor() {
    this.estudiantes = [];
  }

  agregarEstudiante(estudiante) {
    if (!this.estudiantes.some((buscarEstudiante) => buscarEstudiante.getId === estudiante.getId)) {
      this.estudiantes.push(estudiante);
      console.log(`Estudiante ${estudiante.nombre} agregado.`);
    } else {
      console.log("El estudiante ya existe.");
    }
  }

  eliminarEstudiante(id) {
    const index = this.estudiantes.findIndex((estudiante) => estudiante.id === id);
    if (index !== -1) {
      console.log(`Estudiante ${this.estudiantes[index].nombre} eliminado.`);
      this.estudiantes.splice(index, 1);
    } else {
      console.log("Estudiante no encontrado.");
    }
  }

  listarEstudiantes() {
    this.estudiantes.forEach((estudiante) => {
      console.log(estudiante.mostrarEstudiante());
    });
  }

  generarReporte() {
    this.estudiantes.forEach((estudiante) => {
      console.log(estudiante.mostrarEstudiante());
      Object.keys(estudiante.getAsignaturas).forEach((asignatura) => {
        const promedio = estudiante.calcularPromedioAsignatura(asignatura);
        console.log(`  Asignatura: ${asignatura}, Promedio: ${promedio}`);
      });
    });
  }
}

console.log("\n\nEjemplos de funcionamiento\n\n");

const sistema = new SistemaGestionAcademica();

const direccionEstudiante1 = new Direccion("Calle Arquitecto Felipe Gimenez Lacal", 7, "5º", "18014", "Granada", "Granada");
const direccionEstudiante2 = new Direccion("Barriada Andalucia", 3, "3º", "29770", "Malaga", "Torrox");
const direccionEstudiante3 = new Direccion("Calle pez", 14, "Bajo", "29763", "Malaga", "Torremolinos");
const direccionEstudiante4 = new Direccion("Calle Duarte", 58, "2º", "28001", "Madrid", "Madrid");
const direccionEstudiante5 = new Direccion("Los veiros", 21, "8º", "27298", "Lugo", "Bresh");

const estudiante1 = new Estudiante("53899109N", "Javier Escobar Vela", 19, direccionEstudiante1);
const estudiante2 = new Estudiante("53899110J", "Alejandro Escobar Vela", 17, direccionEstudiante2);
const estudiante3 = new Estudiante("77470749X", "Patricia Gonzalez Rico", 15, direccionEstudiante3);
const estudiante4 = new Estudiante("62502570F", "Jose Suarez Molina", 12, direccionEstudiante4);
const estudiante5 = new Estudiante("12053867k", "Estrella Diaz Fernandez", 16, direccionEstudiante5);

console.log("\n\nAñadimos estudiantes al sistema\n\n");

sistema.agregarEstudiante(estudiante1);
sistema.agregarEstudiante(estudiante2);
sistema.agregarEstudiante(estudiante3);
sistema.agregarEstudiante(estudiante4);
sistema.agregarEstudiante(estudiante5);

const Cliente = new Asignatura("Cliente");
const Servidor = new Asignatura("Servidor");
const Diseño = new Asignatura("Diseño");
const Despliegue = new Asignatura("Despliegue");
const Empresa = new Asignatura("Empresa");
const Ingles = new Asignatura("Ingles");

console.log("\n\nMatriculacion de algunos estudiantes en el sistema\n\n");

estudiante1.matricular("Cliente", "16/09/2023");
estudiante1.matricular("Servidor", "16/09/2023");
estudiante1.matricular("Diseño", "16/09/2023");
estudiante1.agregarCalificacion("Cliente", 10);
estudiante1.agregarCalificacion("Cliente", 7);
estudiante1.agregarCalificacion("Servidor", 5);
estudiante1.agregarCalificacion("Diseño", 8);
estudiante1.agregarCalificacion("Diseño", 6);

estudiante2.matricular("Despliegue", "08/11/2022");
estudiante2.matricular("Empresa", "08/11/2022");
estudiante2.matricular("Ingles", "08/11/2022");
estudiante2.agregarCalificacion("Despliegue", 5);
estudiante2.agregarCalificacion("Despliegue", 6);
estudiante2.agregarCalificacion("Empresa", 8);
estudiante2.agregarCalificacion("Empresa", 5.5);
estudiante2.agregarCalificacion("Ingles", 7.5);
estudiante2.agregarCalificacion("Ingles", 9);

console.log("\n\nListamos todos los estudiantes\n\n");

console.log(sistema.listarEstudiantes());

console.log("\n\nHacemos un reporte gerenal de los estudiantes (aquí incluye asignaturas y medias)\n\n");

console.log(sistema.generarReporte());

console.log("\n\nMenú funcional con opciones para el manejo del sistema.\n\n");

function menu() {
  const sistema = new SistemaGestionAcademica();

  while (true) {
    console.log("\n===== Sistema de Gestión Académica =====");
    console.log("1. Añadir estudiante");
    console.log("2. Eliminar estudiante");
    console.log("3. Listar estudiantes");
    console.log("4. Listar estudiante por nombre");
    console.log("5. Matricular estudiante");
    console.log("6. Desmatricular estudiante");
    console.log("7. Añadir calificación");
    console.log("8. Buscar asignaturas por nombre");
    console.log("9. Calcular promedio de asignatura de un estudiante");
    console.log("10. Calcular promedio general de una asignatura");
    console.log("11. Calcular promedio general");
    console.log("12. Generar reporte general");
    console.log("0. Salir");
    let opcion = window.prompt("Abre la consola y selecciona una opción: ");

    switch (opcion) {
      case '1': {
        const id = window.prompt("Introduce el ID del estudiante: ");
        const nombre = window.prompt("Introduce el nombre: ");
        const edad = parseInt(window.prompt("Introduce la edad: "), 10);
        const calle = window.prompt("Introduce la calle: ");
        const numero = window.prompt("Introduce el número: ");
        const piso = window.prompt("Introduce el piso: ");
        const codPostal = window.prompt("Introduce el código postal: ");
        const provincia = window.prompt("Introduce la provincia: ");
        const localidad = window.prompt("Introduce la localidad: ");

        const direccion = new Direccion(calle, numero, piso, codPostal, provincia, localidad);
        const estudiante = new Estudiante(id, nombre, edad, direccion);
        sistema.agregarEstudiante(estudiante);
        break;
      }

      case '2': {
        const id = window.prompt("Introduce el ID del estudiante a eliminar: ");
        sistema.eliminarEstudiante(id);
        break;
      }

      case '3':{
        console.log("\n== Lista de Estudiantes ==");
        sistema.listarEstudiantes();
        break;
      }

      case '4': {
        const nombre = window.prompt("Introduce el nombre o parte del nombre del estudiante: ").toLowerCase();
        const resultados = sistema.estudiantes.filter((estudiante) => 
          estudiante.getNombre.toLowerCase().includes(nombre)
        );

        if (resultados.length > 0) {
          console.log(`\n== Estudiantes encontrados con el nombre que contiene "${nombre}" ==`);
          resultados.forEach((estudiante) => {
            console.log(estudiante.mostrarEstudiante());
          });
        } else {
          console.log(`No se encontraron estudiantes con el nombre que contiene "${nombre}".`);
        }
        break;
      }

      case '5': {
        const id = window.prompt("Introduce el ID del estudiante: ");
        const asignatura = window.prompt("Introduce el nombre de la asignatura: ");
        const fecha = window.prompt("Introduce la fecha de matriculación: ");
        const estudiante = sistema.estudiantes.find(estudiante => estudiante.id === id);
        if (estudiante) {
          estudiante.matricular(asignatura, fecha);
        } else {
          console.log("Estudiante no encontrado.");
        }
        break;
      }

      case '6': {
        const id = window.prompt("Introduce el ID del estudiante: ");
        const asignatura = window.prompt("Introduce el nombre de la asignatura: ");
        const estudiante = sistema.estudiantes.find(estudiante => estudiante.id === id);
        if (estudiante) {
          estudiante.desmatricular(asignatura);
        } else {
          console.log("Estudiante no encontrado.");
        }
        break;
      }

      case '7': {
        const id = window.prompt("Introduce el ID del estudiante: ");
        const asignatura = window.prompt("Introduce el nombre de la asignatura: ");
        const calificacion = parseFloat(window.prompt("Introduce la calificación: "));
        const estudiante = sistema.estudiantes.find(estudiante => estudiante.id === id);
        if (estudiante) {
          estudiante.agregarCalificacion(asignatura, calificacion);
        } else {
          console.log("Estudiante no encontrado.");
        }
        break;
      }

      case '8': {
        const patron = window.prompt("Introduce el patrón de texto para buscar asignaturas: ").toLowerCase();
        let asignaturasEncontradas = [];

        // Buscar asignaturas que coincidan parcialmente con el patrón
        sistema.estudiantes.forEach((estudiante) => {
          Object.keys(estudiante.getAsignaturas).forEach((asignatura) => {
            if (asignatura.toLowerCase().includes(patron)) {
              asignaturasEncontradas.push(asignatura);
            }
          });
        });

        // Mostrar las asignaturas encontradas
        if (asignaturasEncontradas.length > 0) {
          console.log(`\n== Asignaturas encontradas con el patrón "${patron}" ==`);
          asignaturasEncontradas.forEach((asignatura) => {
            console.log(asignatura);
          });
        } else {
          console.log(`No se encontraron asignaturas con el patrón "${patron}".`);
        }
        break;
      }

      case '9': {
        const id = window.prompt("Introduce el ID del estudiante: ");
        const asignatura = window.prompt("Introduce el nombre de la asignatura: ");
        const estudiante = sistema.estudiantes.find(estudiante => estudiante.id === id);
        if (estudiante) {
          const promedio = estudiante.calcularPromedioAsignatura(asignatura);
          console.log(`Promedio en ${asignatura}: ${promedio}`);
        } else {
          console.log("Estudiante no encontrado.");
        }
        break;
      }

      case '10': {
        const asignatura = window.prompt("Introduce el nombre de la asignatura: ");
        let totalCalificaciones = 0;
        let cantidadCalificaciones = 0;

        sistema.estudiantes.forEach((estudiante) => {
          if (asignatura in estudiante.getAsignaturas) {
            const calificaciones = estudiante.getAsignaturas[asignatura];
            totalCalificaciones += calificaciones.reduce((total, nota) => total + nota, 0);
            cantidadCalificaciones += calificaciones.length;
          }
        });

        if (cantidadCalificaciones > 0) {
          const promedio = (totalCalificaciones / cantidadCalificaciones).toFixed(2);
          console.log(`Promedio general de la asignatura "${asignatura}": ${promedio}`);
        } else {
          console.log(`No hay calificaciones registradas para la asignatura "${asignatura}".`);
        }
        break;
      }

      case '11': {
        const id = window.prompt("Introduce el ID del estudiante: ");
        const estudiante = sistema.estudiantes.find(estudiante => estudiante.id === id);
        if (estudiante) {
          const promedio = estudiante.calcularPromedioGeneral();
          console.log(`Promedio general: ${promedio}`);
        } else {
          console.log("Estudiante no encontrado.");
        }
        break;
      }

      case '12':
        console.log("\n--- Reporte General ---");
        sistema.generarReporte();
        break;

      case '0':
        console.log("Saliendo del sistema...");
        return;

      default:
        console.log("Opción no válida.");
    }
  }
}

menu();
