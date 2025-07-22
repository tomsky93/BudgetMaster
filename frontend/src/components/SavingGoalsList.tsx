import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { SavingGoalSchema } from "../api/api";
import api from "../configApi";
import { Money } from "./Money";

type Props = Parameters<typeof api.savings.readItemsSavingsGet>[0];

const SavingsGoals: React.FC<Props> = () => {
  const { data, isLoading, isError } = useQuery<SavingGoalSchema[]>({
    queryKey: ["savingsGoals"],
    queryFn: async () => {
      const response = await api.savings.readItemsSavingsGet();
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center">Loading data...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 py-8">
        Error while loading data
      </div>
    );

  return (
    <div>
      {data!.map((goal) => (
        <Card key={goal.id} className="mb-2 p-2">
          <div className="flex items-center mb-2">
            <i className={`${goal.icon} text-4xl mr-4`} />
            <h2 className="text-xl">{goal.title}</h2>
          </div>
          <div className="mb-1">
            <ProgressBar
              value={goal.progress_percent}
              showValue
              className="h-4 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600">
            Saved:{" "}
            <span className="font-medium">
              <Money amount={goal.current_amount ?? 0} />
            </span>
            /
            <span className="font-medium">
              <Money amount={goal.target_amount} />
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Deadline: {new Date(goal.deadline).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default SavingsGoals;
