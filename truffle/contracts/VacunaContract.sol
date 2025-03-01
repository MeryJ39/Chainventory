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
        bool activa; // 📌 Nueva propiedad para marcar la vacuna como activa/inactiva
    }

    mapping(uint => Vacuna) public vacunas;
    uint public siguienteVacunaId = 1;
    
    event VacunaRegistrada(uint id, string tipo_vacuna, uint fecha_registro);
    event VacunaActualizada(uint id, string tipo_vacuna, uint fecha_registro);
    event VacunaEliminada(uint id);

    // 📌 Registrar una nueva vacuna
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
            _veterinario, _observaciones, _id_animal, true
        );

        emit VacunaRegistrada(id, _tipo_vacuna, block.timestamp);
    }

    // 📌 Obtener una vacuna por ID
    function obtenerVacuna(uint id) public view returns (
        string memory id_hembra,
        string memory especie,
        string memory raza,
        uint edad,
        string memory tipo_vacuna,
        uint dosis_administrada,
        uint fecha_proxima_dosis,
        string memory veterinario,
        string memory observaciones,
        uint id_animal,
        bool activa
    ) {
        require(id < siguienteVacunaId, "Vacuna no encontrada.");
        Vacuna storage v = vacunas[id];
        return (
            v.id_hembra, v.especie, v.raza, v.edad, v.tipo_vacuna, 
            v.dosis_administrada, v.fecha_proxima_dosis, 
            v.veterinario, v.observaciones, v.id_animal, v.activa
        );
    }

    // 📌 Listar todas las vacunas activas
    function listarVacunas() public view returns (Vacuna[] memory) {
        uint totalActivas = 0;

        // Contamos cuántas vacunas están activas
        for (uint i = 1; i < siguienteVacunaId; i++) {
            if (vacunas[i].activa) {
                totalActivas++;
            }
        }

        // Creamos un array con solo las vacunas activas
        Vacuna[] memory lista = new Vacuna[](totalActivas);
        uint index = 0;
        for (uint i = 1; i < siguienteVacunaId; i++) {
            if (vacunas[i].activa) {
                lista[index] = vacunas[i];
                index++;
            }
        }

        return lista;
    }

    // 📌 Listar todas las vacunas aplicadas a un animal
    function listarVacunasPorAnimal(uint idAnimal) public view returns (Vacuna[] memory) {
        uint totalVacunas = 0;

        // Contamos cuántas vacunas tiene el animal
        for (uint i = 1; i < siguienteVacunaId; i++) {
            if (vacunas[i].id_animal == idAnimal && vacunas[i].activa) {
                totalVacunas++;
            }
        }

        // Creamos un array con solo las vacunas de ese animal
        Vacuna[] memory lista = new Vacuna[](totalVacunas);
        uint index = 0;
        for (uint i = 1; i < siguienteVacunaId; i++) {
            if (vacunas[i].id_animal == idAnimal && vacunas[i].activa) {
                lista[index] = vacunas[i];
                index++;
            }
        }

        return lista;
    }

    // 📌 Actualizar una vacuna existente
    function actualizarVacuna(
        uint id,
        string memory _id_hembra,
        string memory _especie,
        string memory _raza,
        uint _edad,
        string memory _tipo_vacuna,
        uint _dosis_administrada,
        uint _fecha_proxima_dosis,
        string memory _veterinario,
        string memory _observaciones
    ) public {
        require(id < siguienteVacunaId, "Vacuna no encontrada.");
        Vacuna storage v = vacunas[id];

        v.id_hembra = _id_hembra;
        v.especie = _especie;
        v.raza = _raza;
        v.edad = _edad;
        v.tipo_vacuna = _tipo_vacuna;
        v.dosis_administrada = _dosis_administrada;
        v.fecha_proxima_dosis = _fecha_proxima_dosis;
        v.veterinario = _veterinario;
        v.observaciones = _observaciones;

        emit VacunaActualizada(id, _tipo_vacuna, block.timestamp);
    }

    // 📌 Eliminar (desactivar) una vacuna
    function eliminarVacuna(uint id) public {
        require(id < siguienteVacunaId, "Vacuna no encontrada.");
        vacunas[id].activa = false;

        emit VacunaEliminada(id);
    }
}
