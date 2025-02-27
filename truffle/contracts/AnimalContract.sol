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
}
