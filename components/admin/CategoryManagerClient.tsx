"use client";

import React, { useActionState, useState } from "react";
import { saveCategoryAction, deleteCategoryAction } from "@/app/admin/admin-actions";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, Loader2, FolderTree } from "lucide-react";
import type { DBCategory } from "@/types/supabase";

interface CategoryManagerClientProps {
  initialCategories: (DBCategory & { product_count: number })[];
}

export default function CategoryManagerClient({ initialCategories }: CategoryManagerClientProps) {
  const [editingCategory, setEditingCategory] = useState<(DBCategory & { product_count?: number }) | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [state, action, pending] = useActionState(async (prev: any, formData: FormData) => {
    const res = await saveCategoryAction(prev, formData);
    if (res.success) {
      setIsFormOpen(false);
      setEditingCategory(null);
    }
    return res;
  }, { error: "" });

  const handleEdit = (category: DBCategory & { product_count?: number }) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    setDeleteError(null);
    setDeleteSuccess(null);

    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await deleteCategoryAction(id);
      if (res?.error) {
        setDeleteError(res.error);
      } else {
        setDeleteSuccess(`Category "${name}" removed successfully.`);
      }
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {deleteError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{deleteError}</span>
        </div>
      )}
      {deleteSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{deleteSuccess}</span>
        </div>
      )}

      {/* Category Creation / Edit Modal Form */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl border border-stone-300 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-base text-stone-900">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              Close Form
            </button>
          </div>

          {state?.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={action} className="space-y-4">
            {editingCategory?.id && <input type="hidden" name="id" value={editingCategory.id} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ""}
                  placeholder="e.g. Dining Sets"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCategory?.slug || ""}
                  placeholder="e.g. dining-sets"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category Description
              </label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editingCategory?.description || ""}
                placeholder="Brief summary of items in this category..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editingCategory ? editingCategory.is_active : true}
                className="w-4 h-4 rounded text-[#5A3E2B] focus:ring-[#5A3E2B]"
              />
              <span className="text-xs font-semibold text-stone-800">Category Active</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="px-5 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] flex items-center gap-2 disabled:opacity-50"
              >
                {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Save Category</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Header */}
      {!isFormOpen && (
        <div className="flex justify-end">
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4" /> Add New Category
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Linked Products</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {initialCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    {cat.name}
                    {cat.description && (
                      <p className="text-[11px] text-stone-500 font-normal mt-0.5 line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">{cat.slug}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">{cat.product_count} items</td>
                  <td className="py-3.5 px-4">
                    {cat.is_active ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#5A3E2B] hover:text-white transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg bg-stone-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
