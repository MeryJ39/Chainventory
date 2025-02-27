// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductoContract {
    struct Producto {
        uint id;
        string tipo;
        string descripcion;
        string especie;
        uint edad;
        string raza;
        uint cantidad;
        string movimiento;
        string guia_animal;
        string autorizacion_senasac;
        string destino;
        uint saldo_actual;
        string observaciones;
        uint id_animal;
        uint fecha_ingreso;
    }

    mapping(uint => Producto) public productos;
    uint public siguienteProductoId = 1;

    event ProductoRegistrado(uint id, string tipo, uint cantidad, uint fecha_ingreso);

    function registrarProducto(
        string memory _tipo,
        string memory _descripcion,
        string memory _especie,
        uint _edad,
        string memory _raza,
        uint _cantidad,
        string memory _movimiento,
        string memory _guia_animal,
        string memory _autorizacion_senasac,
        string memory _destino,
        uint _saldo_actual,
        string memory _observaciones,
        uint _id_animal
    ) public {
        uint id = siguienteProductoId++;
        productos[id] = Producto(
            id, _tipo, _descripcion, _especie, _edad, _raza, _cantidad, _movimiento,
            _guia_animal, _autorizacion_senasac, _destino, _saldo_actual,
            _observaciones, _id_animal, block.timestamp
        );

        emit ProductoRegistrado(id, _tipo, _cantidad, block.timestamp);
    }
}
