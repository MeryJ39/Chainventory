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
        bool activo; // 🔥 Nuevo campo para indicar si el producto está activo
    }

    mapping(uint => Producto) public productos;
    uint public siguienteProductoId = 1;

    event ProductoRegistrado(uint id, string tipo, uint cantidad, uint fecha_ingreso);
    event ProductoActualizado(uint id, string tipo, uint cantidad);
    event ProductoEliminado(uint id);

    // 📌 Registrar un nuevo producto
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
            _observaciones, _id_animal, block.timestamp, true
        );

        emit ProductoRegistrado(id, _tipo, _cantidad, block.timestamp);
    }

    // 📌 Actualizar información general del producto
    function actualizarProductoInfo(
        uint _id,
        string memory _tipo,
        string memory _descripcion,
        string memory _especie,
        uint _edad,
        string memory _raza
    ) public {
        require(productos[_id].activo, "El producto no existe o ha sido eliminado");

        Producto storage p = productos[_id];
        p.tipo = _tipo;
        p.descripcion = _descripcion;
        p.especie = _especie;
        p.edad = _edad;
        p.raza = _raza;

        emit ProductoActualizado(_id, _tipo, p.cantidad);
    }

    // 📌 Actualizar información de inventario del producto
    function actualizarProductoInventario(
        uint _id,
        uint _cantidad,
        string memory _movimiento,
        string memory _guia_animal,
        string memory _autorizacion_senasac,
        string memory _destino,
        uint _saldo_actual,
        string memory _observaciones
    ) public {
        require(productos[_id].activo, "El producto no existe o ha sido eliminado");

        Producto storage p = productos[_id];
        p.cantidad = _cantidad;
        p.movimiento = _movimiento;
        p.guia_animal = _guia_animal;
        p.autorizacion_senasac = _autorizacion_senasac;
        p.destino = _destino;
        p.saldo_actual = _saldo_actual;
        p.observaciones = _observaciones;

        emit ProductoActualizado(_id, p.tipo, _cantidad);
    }

    // 📌 Eliminar un producto (desactivarlo)
    function eliminarProducto(uint _id) public {
        require(productos[_id].activo, "El producto ya ha sido eliminado");
        productos[_id].activo = false;
        emit ProductoEliminado(_id);
    }

    // 📌 Obtener un producto por ID (Optimizado para evitar error de pila)
    function obtenerProducto(uint _id) public view returns (
        uint, string memory, string memory, string memory, uint, string memory, uint, bool
    ) {
        require(productos[_id].activo, "El producto no existe o ha sido eliminado");
        Producto memory p = productos[_id];

        return (
            p.id, p.tipo, p.descripcion, p.especie, p.edad, p.raza, p.cantidad, p.activo
        );
    }

    // 📌 Listar todos los productos activos
    function listarProductos() public view returns (Producto[] memory) {
        uint totalProductos = siguienteProductoId - 1;
        uint contador = 0;
        Producto[] memory productosActivos = new Producto[](totalProductos);

        for (uint i = 1; i <= totalProductos; i++) {
            if (productos[i].activo) {
                productosActivos[contador] = productos[i];
                contador++;
            }
        }

        return productosActivos;
    }
}
