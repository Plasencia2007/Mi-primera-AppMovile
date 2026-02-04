import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import {
  ArrowLeft,
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  X,
  Upload,
  Check,
  ChevronRight,
  PlusCircle,
  Tag,
  Clock,
  Star as StarIcon,
} from "lucide-react-native";
import { supabase } from "../../../services/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../../theme";
import { useAdmin } from "../store/useAdmin";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

interface AdminProductsScreenProps {
  onBack: () => void;
}

export const AdminProductsScreen = ({ onBack }: AdminProductsScreenProps) => {
  const insets = useSafeAreaInsets();
  const { fetchProducts, saveProduct, deleteProduct, isLoading } = useAdmin();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    tag: "Nuevo",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      tag: product.tag || "Nuevo",
    });
    setSelectedImage(product.image_url || null);
    setIsModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      tag: "Nuevo",
    });
    setSelectedImage(null);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);
              loadProducts();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          },
        },
      ],
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // Guardamos el base64 solo si es una nueva imagen para subir
      setFormData({ ...formData, image_url: result.assets[0].base64 || "" });
    }
  };

  const uploadImage = async (base64: string) => {
    try {
      setIsUploading(true);
      const fileName = `${Date.now()}.jpg`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("products")
        .upload(filePath, decode(base64), {
          contentType: "image/jpeg",
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert("Error", "Nombre y precio son obligatorios");
      return;
    }

    try {
      setIsSaving(true);

      let finalImageUrl = selectedImage;

      // Si hay un base64 en image_url significa que es una imagen nueva para subir
      if (formData.image_url && !formData.image_url.startsWith("http")) {
        finalImageUrl = await uploadImage(formData.image_url);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: finalImageUrl,
        tag: formData.tag,
        category_id: formData.category_id || null,
        ...(editingProduct?.id ? { id: editingProduct.id } : {}),
      };

      await saveProduct(productData);
      setIsModalVisible(false);
      loadProducts();
    } catch (error: any) {
      console.error("Save Product Error:", error);
      Alert.alert("Error", error.message || "No se pudo guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestión de Productos</Text>
          <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
              style={styles.inputInner}
            />
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                {product.image_url ? (
                  <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Package size={32} color="#CBD5E1" />
                  </View>
                )}
                {product.tag && (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{product.tag}</Text>
                  </View>
                )}
              </View>

              <View style={styles.productInfo}>
                <View style={styles.productHeaderRow}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>S/ {product.price}</Text>
                </View>
                <Text style={styles.productDesc} numberOfLines={2}>
                  {product.description || "Sin descripción"}
                </Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleEdit(product)}
                  >
                    <Edit2 size={18} color="#64748B" />
                    <Text style={styles.actionBtnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteAction]}
                    onPress={() => handleDelete(product.id)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={[styles.actionBtnText, { color: "#EF4444" }]}>
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {filteredProducts.length === 0 && (
            <View style={styles.emptyView}>
              <Package size={64} color="#E2E8F0" />
              <Text style={styles.emptyTitle}>No hay productos</Text>
              <Text style={styles.emptySubtitle}>
                Parece que aún no has agregado ningún producto a tu catálogo.
              </Text>
              <Button
                title="Agregar mi primer producto"
                onPress={handleAddNew}
                variant="primary"
                style={styles.emptyButton}
              />
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Form Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { marginTop: insets.top + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeModalBtn}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContent}>
              <Input
                label="Nombre del Producto"
                placeholder="Ej: Hamburguesa de Pollo"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />

              <Input
                label="Descripción"
                placeholder="Ingresa los detalles aquí..."
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: "top" }}
              />

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Input
                    label="Precio (S/)"
                    placeholder="25.00"
                    value={formData.price}
                    onChangeText={(text) =>
                      setFormData({ ...formData, price: text })
                    }
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Etiqueta"
                    placeholder="Popular, Nuevo..."
                    value={formData.tag}
                    onChangeText={(text) =>
                      setFormData({ ...formData, tag: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.imagePickerSection}>
                <Text style={styles.fieldLabel}>Categoría</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.catScroll}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() =>
                        setFormData({ ...formData, category_id: cat.id })
                      }
                      style={[
                        styles.catOption,
                        formData.category_id === cat.id &&
                          styles.catOptionActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catOptionText,
                          formData.category_id === cat.id &&
                            styles.catOptionTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.imagePickerSection}>
                <Text style={styles.fieldLabel}>Imagen del Producto</Text>
                <TouchableOpacity
                  style={styles.imagePickerBtn}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.pickerPreview}
                    />
                  ) : (
                    <View style={styles.pickerPlaceholder}>
                      <Upload size={32} color="#64748B" />
                      <Text style={styles.pickerText}>Seleccionar Imagen</Text>
                    </View>
                  )}
                  {isUploading && (
                    <View style={styles.uploadOverlay}>
                      <ActivityIndicator color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.modalFooter}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => setIsModalVisible(false)}
                  style={{ flex: 1, marginRight: 12 }}
                />
                <Button
                  title={editingProduct ? "Actualizar" : "Crear Producto"}
                  onPress={handleSave}
                  loading={isSaving}
                  style={{ flex: 2 }}
                />
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#0F172A",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  inputInner: {
    height: 48,
    borderWidth: 0,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  productImageContainer: {
    width: 110,
    height: 110,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F1F5F9",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  tagBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  productInfo: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  productHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  productName: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontFamily: "Outfit_800ExtraBold",
    fontSize: 15,
    color: colors.primary,
  },
  productDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  deleteAction: {
    backgroundColor: "#FFF5F5",
  },
  actionBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#64748B",
  },
  emptyView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#0F172A",
    marginTop: 20,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 24,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: "#0F172A",
  },
  closeModalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  formContent: {
    padding: 24,
  },
  formRow: {
    flexDirection: "row",
  },
  modalFooter: {
    flexDirection: "row",
    marginTop: 20,
  },
  imagePickerSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
    marginLeft: 4,
  },
  imagePickerBtn: {
    width: "100%",
    height: 200,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerPreview: {
    width: "100%",
    height: "100%",
  },
  pickerPlaceholder: {
    alignItems: "center",
    gap: 12,
  },
  pickerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#64748B",
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  catScroll: {
    flexDirection: "row",
    gap: 8,
  },
  catOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  catOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catOptionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#64748B",
  },
  catOptionTextActive: {
    color: "#FFFFFF",
  },
});
