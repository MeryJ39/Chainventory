// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnimalContract {
    struct Animal {
        uint id;
        string id_hembra;
        string nombre;
        string ganadera;
        uint fecha_ingreso;
        uint fecha_nacimiento;
        uint edad;
        string categoria_ingreso;
        string categoria_actual;
        string estatus;
        uint fecha_retiro;
        string causa_mortalidad;
    }

    mapping(uint => Animal) public animales;
    uint public siguienteAnimalId = 1;

    event AnimalRegistrado(uint id, string nombre, uint fecha_ingreso);
    event AnimalActualizado(uint id, string nombre, uint fecha_ingreso);
    event AnimalRetirado(uint id, string causa, uint fecha_retiro);
    event CategoriaCambiada(uint id, string nueva_categoria);

    // 📌 Registrar un nuevo animal
    function registrarAnimal(
        string memory _id_hembra,
        string memory _nombre,
        string memory _ganadera,
        uint _fecha_nacimiento,
        uint _edad,
        string memory _categoria_ingreso,
        string memory _categoria_actual,
        string memory _estatus
    ) public {
        uint id = siguienteAnimalId++;
        animales[id] = Animal(
            id, _id_hembra, _nombre, _ganadera, block.timestamp, _fecha_nacimiento,
            _edad, _categoria_ingreso, _categoria_actual, _estatus, 0, ""
        );

        emit AnimalRegistrado(id, _nombre, block.timestamp);
    }

    // 📌 Obtener los datos de un animal por su ID
    function obtenerAnimal(uint _id) public view returns (
        string memory, string memory, string memory, uint, uint, uint,
        string memory, string memory, string memory, uint, string memory
    ) {
        require(animales[_id].id != 0, "Animal no encontrado");

        Animal memory animal = animales[_id];
        return (
            animal.id_hembra, animal.nombre, animal.ganadera, animal.fecha_ingreso,
            animal.fecha_nacimiento, animal.edad, animal.categoria_ingreso,
            animal.categoria_actual, animal.estatus, animal.fecha_retiro,
            animal.causa_mortalidad
        );
    }

    // 📌 Listar todos los animales
    function listarAnimales() public view returns (Animal[] memory) {
        Animal[] memory lista = new Animal[](siguienteAnimalId - 1);
        for (uint i = 1; i < siguienteAnimalId; i++) {
            lista[i - 1] = animales[i];
        }
        return lista;
    }

    // 📌 Actualizar los datos de un animal
    function actualizarAnimal(
        uint _id,
        string memory _nombre,
        string memory _ganadera,
        uint _edad,
        string memory _estatus
    ) public {
        require(animales[_id].id != 0, "Animal no encontrado");

        Animal storage animal = animales[_id];
        animal.nombre = _nombre;
        animal.ganadera = _ganadera;
        animal.edad = _edad;
        animal.estatus = _estatus;

        emit AnimalActualizado(_id, _nombre, animal.fecha_ingreso);
    }

    // 📌 Retirar un animal (por venta, muerte, etc.)
    function retirarAnimal(uint _id, string memory _causa) public {
        require(animales[_id].id != 0, "Animal no encontrado");

        Animal storage animal = animales[_id];
        animal.fecha_retiro = block.timestamp;
        animal.causa_mortalidad = _causa;
        animal.estatus = "Retirado";

        emit AnimalRetirado(_id, _causa, block.timestamp);
    }

    // 📌 Cambiar la categoría de un animal
    function cambiarCategoria(uint _id, string memory _nuevaCategoria) public {
        require(animales[_id].id != 0, "Animal no encontrado");

        Animal storage animal = animales[_id];
        animal.categoria_actual = _nuevaCategoria;

        emit CategoriaCambiada(_id, _nuevaCategoria);
    }
}
