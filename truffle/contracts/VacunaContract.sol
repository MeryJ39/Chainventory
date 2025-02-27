// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VacunaContract {
    struct Vacuna {
        uint id;
        uint fecha_registro;
        string id_hembra;
        string especie;
        string raza;
        uint edad;
        string tipo_vacuna;
        uint dosis_administrada;
        uint fecha_proxima_dosis;
        string veterinario;
        string observaciones;
        uint id_animal;
    }

    mapping(uint => Vacuna) public vacunas;
    uint public siguienteVacunaId = 1;

    event VacunaRegistrada(uint id, string tipo_vacuna, uint fecha_registro);

    function registrarVacuna(
        string memory _id_hembra,
        string memory _especie,
        string memory _raza,
        uint _edad,
        string memory _tipo_vacuna,
        uint _dosis_administrada,
        uint _fecha_proxima_dosis,
        string memory _veterinario,
        string memory _observaciones,
        uint _id_animal
    ) public {
        uint id = siguienteVacunaId++;
        vacunas[id] = Vacuna(
            id, block.timestamp, _id_hembra, _especie, _raza, _edad,
            _tipo_vacuna, _dosis_administrada, _fecha_proxima_dosis, 
            _veterinario, _observaciones, _id_animal
        );

        emit VacunaRegistrada(id, _tipo_vacuna, block.timestamp);
    }
}
