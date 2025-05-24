import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "./hooks/useWallet";
import Home from "./pages/Home";
import WentgePage from "./pages/WentgePage";
import FoomPage from "./pages/FoomPage";
import SVGTestPage from "./pages/SVGTestPage";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/wentge" component={WentgePage} />
      <Route path="/foom" component={FoomPage} />
      <Route path="/svgtest" component={SVGTestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <Toaster />
            <Router />
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App render error:', error);
    return <div>App Error: {String(error)}</div>;
  }
}

export default App;
