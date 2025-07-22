import React, { Suspense } from "react";
import { BrowserRouter } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import axios from "axios";
import { AuthProvider } from "./contexts/AuthProvider";
import Layout from "./components/Layout";
import Router from "./routes/paths";

axios.defaults.withCredentials = true;

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => console.error(error),
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => console.error(error),
  }),
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Router />
            </Suspense>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
