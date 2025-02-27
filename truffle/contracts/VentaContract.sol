// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VentaContract {
    struct Venta {
        uint id;
        string comprador;
        string propiedad;
        uint cantidad;
        string gma;
        string clase;
        uint precio_unitario;
        uint total_venta_bs;
        uint total_venta_usd;
        string observacion;
        uint cantidad_dia;
        uint id_animal;
        uint fecha_venta;
    }

    mapping(uint => Venta) public ventas;
    uint public siguienteVentaId = 1;

    event VentaRegistrada(uint id, string comprador, uint cantidad, uint fecha_venta);

    function registrarVenta(
        string memory _comprador,
        string memory _propiedad,
        uint _cantidad,
        string memory _gma,
        string memory _clase,
        uint _precio_unitario,
        uint _total_venta_bs,
        uint _total_venta_usd,
        string memory _observacion,
        uint _cantidad_dia,
        uint _id_animal
    ) public {
        uint id = siguienteVentaId++;
        ventas[id] = Venta(
            id, _comprador, _propiedad, _cantidad, _gma, _clase, _precio_unitario, 
            _total_venta_bs, _total_venta_usd, _observacion, _cantidad_dia, 
            _id_animal, block.timestamp
        );

        emit VentaRegistrada(id, _comprador, _cantidad, block.timestamp);
    }
}
