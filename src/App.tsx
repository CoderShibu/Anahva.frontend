import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ConfidentialModeProvider } from "@/contexts/ConfidentialModeContext";
import { NightWatchProvider } from "@/contexts/NightWatchContext";
import { StressModeProvider } from "@/contexts/StressModeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnimatedBackground from "@/components/AnimatedBackground";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Chat from "./pages/Chat";
import Insights from "./pages/Insights";
import History from "./pages/History";
import SafeCircle from "./pages/SafeCircle";
import Settings from "./pages/Settings";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import PsychologicalReport from "./pages/PsychologicalReport";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import UpgradeSheet from "@/components/UpgradeSheet";
import { motion, AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/home" element={<ProtectedRoute><PageTransition><Home /></PageTransition></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><PageTransition><Journal /></PageTransition></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><PageTransition><Chat /></PageTransition></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><PageTransition><Insights /></PageTransition></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PageTransition><History /></PageTransition></ProtectedRoute>} />
        <Route path="/safe-circle" element={<ProtectedRoute><PageTransition><SafeCircle /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/report" element={<ProtectedRoute><PageTransition><PsychologicalReport /></PageTransition></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><PageTransition><FAQ /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      opacity: { duration: 0.2 }
    }}
  >
    {children}
  </motion.div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccessibilityProvider>
          <ConfidentialModeProvider>
            <NightWatchProvider>
              <StressModeProvider>
                <LanguageProvider>
                  <AuthProvider>
                    <SubscriptionProvider>
                      <TooltipProvider>
                        <AnimatedBackground />
                        <Toaster />
                        <Sonner />
                      <BrowserRouter>
                        <UpgradeSheet />
                        <AppRoutes />
                      </BrowserRouter>
                      </TooltipProvider>
                    </SubscriptionProvider>
                  </AuthProvider>
                </LanguageProvider>
              </StressModeProvider>
            </NightWatchProvider>
          </ConfidentialModeProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
