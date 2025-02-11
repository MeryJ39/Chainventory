import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useProducts } from "../hooks/useProducts";

const Productos = () => {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [nuevoProducto, setNuevoProducto] = useState({
    product_id: "",
    product_type: "",
    description: "",
    species: "",
    breed: "",
    age: "",
    guide_number: "",
    senasac_authorization: "",
    supplier: "",
    brand: "",
    unit_measure: "",
  });

  const [editProduct, setEditProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await createProduct(nuevoProducto);
      setNuevoProducto({
        product_id: "",
        product_type: "",
        description: "",
        species: "",
        breed: "",
        age: "",
        guide_number: "",
        senasac_authorization: "",
        supplier: "",
        brand: "",
        unit_measure: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleEditOpen = (product) => {
    const { _id, __v, ...filteredProduct } = product; // Excluir _id y __v
    setEditProduct(filteredProduct);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditProduct(null);
  };

  const handleEditChange = (e) => {
    if (editProduct) {
      setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    if (editProduct) {
      try {
        await updateProduct(editProduct.product_id, editProduct);
        setIsEditDialogOpen(false);
        setEditProduct(null);
        fetchProducts();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-5 transition-colors delay-300 bg-background">
      <Typography variant="h4" className="mb-4">
        Gestión de Productos
      </Typography>

      <Card className="mb-5 transition-colors delay-300 bg-background text-text ">
        <CardBody>
          <Typography variant="h4" className="mb-4 ">
            Añadir Producto
          </Typography>

          <div className="grid grid-cols-3 gap-4 ">
            {Object.keys(nuevoProducto).map((key) => (
              <Input
                key={key}
                type="text"
                label={key.replace("_", " ").toUpperCase()}
                name={key}
                value={nuevoProducto[key]}
                onChange={handleChange}
                className="transition-colors delay-300 border-text text-text"
              />
            ))}
          </div>
          <Button className="mt-4 bg-secondary " onClick={handleCreate}>
            Agregar Producto
          </Button>
        </CardBody>
      </Card>

      <Card className="transition-colors delay-300 bg-background text-text">
        <CardBody>
          <Typography variant="h5" className="mb-4 ">
            Lista de Productos
          </Typography>

          {products.length === 0 ? (
            <Typography>No hay productos disponibles</Typography>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="flex justify-between p-3 border-b"
                >
                  <Typography>
                    {product.product_id} - {product.product_type}
                  </Typography>
                  <div className="flex gap-2">
                    <IconButton
                      size="sm"
                      onClick={() => handleEditOpen(product)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      size="sm"
                      onClick={() => handleDelete(product.product_id)}
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} handler={handleEditClose} className="p-4">
        {" "}
        {/* Added padding */}
        <DialogHeader className="relative block m-0">
          <Typography variant="h5" color="blue-gray">
            Editar Producto
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleEditClose}
          >
            <XMarkIcon className="w-4 h-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="pb-6 space-y-4">
          {editProduct && (
            <div className="grid grid-cols-3 gap-4">
              {" "}
              {/* 2-column grid */}
              {Object.keys(editProduct).map((key) => (
                <div key={key}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium text-left"
                  >
                    {key.replace("_", " ").toUpperCase()}
                  </Typography>
                  <Input
                    color="gray"
                    size="lg"
                    name={key}
                    value={editProduct[key]}
                    onChange={handleEditChange}
                    className="placeholder:opacity-100 focus:!border-t-gray-900"
                    containerProps={{
                      className: "!min-w-full",
                    }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleUpdate} size="sm">
            Actualizar Producto
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Productos;
