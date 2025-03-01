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
        bool activa; // Nueva propiedad para marcar la venta como eliminada
    }

    mapping(uint => Venta) public ventas;
    uint public siguienteVentaId = 1;

    event VentaRegistrada(uint id, string comprador, uint cantidad, uint fecha_venta);
    event VentaActualizada(uint id, string comprador, uint cantidad);
    event VentaEliminada(uint id);

    // 📌 Registrar una nueva venta
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
            _id_animal, block.timestamp, true
        );

        emit VentaRegistrada(id, _comprador, _cantidad, block.timestamp);
    }

    // 📌 Obtener los datos de una venta por su ID
    function obtenerVenta(uint _id) public view returns (
        string memory, string memory, uint, string memory, string memory, uint,
        uint, uint, string memory, uint, uint, uint, bool
    ) {
        require(ventas[_id].id != 0, "Venta no encontrada");
        require(ventas[_id].activa, "Venta eliminada");

        Venta memory venta = ventas[_id];
        return (
            venta.comprador, venta.propiedad, venta.cantidad, venta.gma,
            venta.clase, venta.precio_unitario, venta.total_venta_bs,
            venta.total_venta_usd, venta.observacion, venta.cantidad_dia,
            venta.id_animal, venta.fecha_venta, venta.activa
        );
    }

    // 📌 Listar todas las ventas activas
    function listarVentas() public view returns (Venta[] memory) {
        uint totalActivas = 0;
        for (uint i = 1; i < siguienteVentaId; i++) {
            if (ventas[i].activa) {
                totalActivas++;
            }
        }

        Venta[] memory lista = new Venta[](totalActivas);
        uint index = 0;
        for (uint i = 1; i < siguienteVentaId; i++) {
            if (ventas[i].activa) {
                lista[index] = ventas[i];
                index++;
            }
        }
        return lista;
    }

    // 📌 Actualizar los datos de una venta
    function actualizarVenta(
        uint _id,
        string memory _comprador,
        string memory _propiedad,
        uint _cantidad,
        string memory _gma,
        string memory _clase,
        uint _precio_unitario,
        uint _total_venta_bs,
        uint _total_venta_usd,
        string memory _observacion,
        uint _cantidad_dia
    ) public {
        require(ventas[_id].id != 0, "Venta no encontrada");
        require(ventas[_id].activa, "Venta eliminada");

        Venta storage venta = ventas[_id];
        venta.comprador = _comprador;
        venta.propiedad = _propiedad;
        venta.cantidad = _cantidad;
        venta.gma = _gma;
        venta.clase = _clase;
        venta.precio_unitario = _precio_unitario;
        venta.total_venta_bs = _total_venta_bs;
        venta.total_venta_usd = _total_venta_usd;
        venta.observacion = _observacion;
        venta.cantidad_dia = _cantidad_dia;

        emit VentaActualizada(_id, _comprador, _cantidad);
    }

    // 📌 Eliminar una venta (marcarla como inactiva)
    function eliminarVenta(uint _id) public {
        require(ventas[_id].id != 0, "Venta no encontrada");
        require(ventas[_id].activa, "Venta ya eliminada");

        ventas[_id].activa = false;
        emit VentaEliminada(_id);
    }
}
