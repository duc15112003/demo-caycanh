import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import categoryApi from "../api/categoryApi";
import productApi from "../api/productApi";
import "../assets/css/admin/admin_style.css";

const initialFormData = {
  categoryId: "",
  productName: "",
  description: "",
  careGuide: "",
  price: "",
  stock: "",
  image: "",
  active: true,
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(Array.isArray(response) ? response : []);
      } catch (error) {
        toast.error(error.customMessage || "Khong tai duoc danh muc");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      await productApi.createProduct(payload);
      toast.success("Them san pham thanh cong");
      navigate("/admin/product");
    } catch (error) {
      toast.error(error.customMessage || "Khong the them san pham");
    }
  };

  return (
    <AdminLayout title="Them san pham" subtitle="Tao moi san pham tren he thong">
      <form onSubmit={handleSubmit} className="adm-form">
        <div className="adm-form-grid">
          <label>
            Danh muc
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">Chon danh muc</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ten san pham
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
          </label>

          <label>
            Gia
            <input type="number" min="0" name="price" value={formData.price} onChange={handleChange} required />
          </label>

          <label>
            So luong ton kho
            <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} required />
          </label>

          <label className="adm-form-full">
            Link hinh anh
            <input type="text" name="image" value={formData.image} onChange={handleChange} />
          </label>

          <label className="adm-form-full">
            Mo ta
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
          </label>

          <label className="adm-form-full">
            Huong dan cham soc
            <textarea name="careGuide" value={formData.careGuide} onChange={handleChange} rows={4} />
          </label>

          <label className="adm-checkbox">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
            San pham dang hoat dong
          </label>
        </div>

        <button type="submit" className="adm-btn">
          Luu san pham
        </button>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;