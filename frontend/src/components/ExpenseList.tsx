import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../configApi";
import type { ExpenseSchema } from "../api";
import { DataTable, DataTableValue } from "primereact/datatable";
import { VirtualScrollerLazyEvent } from "primereact/virtualscroller";
import { Column } from "primereact/column";
import ActionButtons from "./ActionButtons";
import ExpenseForm from "../pages/forms/ExpenseForm";
import { useConfirm } from "../hooks/useConfirm";
import { showSuccess, showError } from "../utils/toast";
import { config, library, IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Money } from "../components/Money";
import { Card } from "primereact/card";

config.autoAddCss = false;
library.add(fas);

interface QueryData {
  items: ExpenseSchema[];
  total_records: number;
}

const ITEM_SIZE = 40;
const ROWS = 10;

const ExpenseList: React.FC<{ month: number; year: number }> = ({
  month,
  year,
}) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [expandedRows, setExpandedRows] = useState<ExpenseSchema[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(ROWS);
  const [virtualItems, setVirtualItems] = useState<DataTableValue[]>([]);
  const [editingExpense, setEditingExpense] = useState<ExpenseSchema | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: queryData } = useQuery<QueryData, Error>({
    queryKey: ["expenses", month, year, first, rows],
    queryFn: async () => {
      const { data: items, headers } = await api.expenses.readItemsExpensesGet({
        skip: first,
        limit: rows,
        month,
        year,
      });

      const totalHeader = headers.get("x-total-count") ?? "0";
      const total_records = parseInt(totalHeader, 10);

      return { items, total_records };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    setFirst(0);
    setRows(ROWS);
    setVirtualItems([]);
    setExpandedRows([]);
  }, [month, year]);

  useEffect(() => {
    if (!queryData) return;
    const { items, total_records } = queryData;
    setVirtualItems((prev) => {
      const base =
        prev.length === total_records
          ? [...prev]
          : Array<DataTableValue>(total_records).fill({});
      items.forEach((item, idx) => {
        base[first + idx] = item;
      });
      return base;
    });
  }, [queryData, first]);

  const onLazyLoad = (e: VirtualScrollerLazyEvent) => {
    const f = (e.first as number) ?? 0;
    const last = (e.last as number) ?? f + ROWS - 1;
    setFirst(f);
    setRows(last - f + 1);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const resp = await api.expenses.deleteItemExpensesItemIdDelete(id);
      return resp.data;
    },
    onSuccess: () => {
      showSuccess("Success", "Expense deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["expenses", month, year] });
      queryClient.invalidateQueries({ queryKey: ["aggregate-expenses-all"] });
      queryClient.invalidateQueries({ queryKey: ["aggregate-expenses"] });
    },
    onError: () => {
      showError("Error", "Failed to delete expense.");
    },
  });

  const handleDelete = useCallback(
    (id: number) =>
      confirm({
        message: "Are you sure you want to delete this expense?",
        accept: () => deleteMutation.mutate(id),
      }),
    [confirm, deleteMutation]
  );

  const dateBodyTemplate = useCallback(
    (rowData: ExpenseSchema) =>
      rowData.date ? new Date(rowData.date).toLocaleDateString() : null,
    []
  );

  const parseIconParts = (faString: string) => {
    const parts = faString.split(/\s+/);
    const prefix = parts.find((p) => ["fas", "far", "fab"].includes(p)) as
      | "fas"
      | "far"
      | "fab";
    const iconName = (
      parts.find((p) => p.startsWith("fa-")) || "fa-question"
    ).replace(/^fa-/, "") as IconName;
    return { prefix, iconName };
  };

  const iconBodyTemplate = useCallback((rowData: ExpenseSchema) => {
    if (!rowData.category_icon) return null;
    const { prefix, iconName } = parseIconParts(rowData.category_icon);
    return (
      <span className="text-xl">
        <FontAwesomeIcon icon={[prefix, iconName]} />
      </span>
    );
  }, []);

  const rowExpansionTemplate = useCallback(
    (data: ExpenseSchema) => (
      <div className="p-4 text-sm text-gray-700 flex items-start">
        <div className="flex-shrink-0 mr-4">
          <ActionButtons
            record={data}
            onEdit={() => {
              setEditingExpense(data);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(data.id)}
          />
        </div>
        <div>
          <p>
            <span className="font-semibold">Description: </span>
            {data.description}
          </p>
          <p className="mt-1">
            <span className="font-semibold">Date: </span>
            {new Date(data.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    ),
    [handleDelete, setEditingExpense, setShowModal]
  );

  return (
    <Card className="pt-0 pb-1 px-1">
      <h6 className="text-2xl text-center pb-2">Expenses</h6>
      <DataTable
        value={virtualItems as DataTableValue[]}
        scrollable
        scrollHeight="380px"
        sortField="date"
        sortOrder={-1}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as ExpenseSchema[])}
        rowExpansionTemplate={rowExpansionTemplate}
        totalRecords={queryData?.total_records ?? 0}
        virtualScrollerOptions={{
          lazy: true,
          onLazyLoad,
          itemSize: ITEM_SIZE,
          numToleratedItems: 0,
          showLoader: true,
          loaderIconTemplate: () => (
            <div className="p-p-2 p-text-center">Loading data…</div>
          ),
        }}
      >
        <Column
          expander
          headerStyle={{ display: "none" }}
          style={{ width: "2rem" }}
        />
        <Column
          body={iconBodyTemplate}
          style={{ width: "3.5rem" }}
          headerStyle={{ display: "none" }}
        />

        <Column field="category_name" headerStyle={{ display: "none" }} />
        <Column
          field="amount"
          headerStyle={{ display: "none" }}
          sortable
          body={(row) => <Money amount={row.amount} />}
        />
        <Column
          field="date"
          headerStyle={{ display: "none" }}
          sortable
          dataType="date"
          body={dateBodyTemplate}
        />
      </DataTable>
      <ExpenseForm
        visible={showModal}
        onHide={() => setShowModal(false)}
        initialData={editingExpense ?? undefined}
      />
    </Card>
  );
};

export default ExpenseList;
