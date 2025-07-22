import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tree, TreeNode } from "primereact/tree";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CategoryForm from "../pages/forms/CategoryForm";
import api from "../configApi";
import type { ExpenseCategorySchema } from "../api";

const CategoryTree: React.FC = () => {
  const { data: categories } = useQuery<ExpenseCategorySchema[]>({
    queryKey: ["expenseCategories"],
    queryFn: async () => {
      const response =
        await api.expenseCategories.readItemsExpenseCategoriesGet();
      return response.data;
    },
  });

  const treeData = (categories ?? []).map((category) => ({
    key: category.id.toString(),
    label: category.name,
    data: category,
    color: category.color,
    children: [],
  }));

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategorySchema | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onEditClick = (
    node: {
      key: string;
      label: string;
      data: ExpenseCategorySchema;
      children: unknown[];
    },
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedCategory(node.data);
    setModalVisible(true);
  };

  const filteredTreeData = treeData.filter((node) =>
    node.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const nodeTemplate = (node: TreeNode) => {
    const { label, data } = node;
    return (
      <div
        className="node-container"
        style={{ width: "100%", display: "flex", alignItems: "center" }}
      >
        <Button
          id={`edit-${node.key}`}
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text edit-icon"
          onClick={(e) =>
            onEditClick(
              {
                key: node.key as string,
                label: label as string,
                data: data as ExpenseCategorySchema,
                children: node.children || [],
              },
              e
            )
          }
          style={{ minWidth: "auto", padding: "0.25rem" }}
        />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mt-16">

      <div style={{ margin: "20px" }}>
      <h1 className="text-3xl">Categories</h1>
        <style>{`
                .node-container {
                    display: flex;
                    align-items: center;
                }
                .edit-icon {
                    display: none;
                    margin-right: 8px;
                    font-size: 0.8rem;
                    color: gray;
                    cursor: pointer;
                }
                .node-container:hover .edit-icon {
                    display: inline-block;
                }
            `}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div className="p-inputgroup" style={{ flexGrow: 1 }}>
            <span className="p-inputgroup-addon">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              id={"searchInput"}
              placeholder=""
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button
            icon="pi pi-plus"
            className="p-button"
            onClick={() => {
              setSelectedCategory(null);
              setModalVisible(true);
            }}
          />
        </div>
        <Tree
          value={filteredTreeData}
          filterMode="lenient"
          nodeTemplate={nodeTemplate}
        />
        <CategoryForm
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          initialData={selectedCategory || undefined}
        />
      </div>
    </div>
  );
};

export default CategoryTree;
