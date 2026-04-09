import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AssessmentIntro = lazy(() => import('./pages/AssessmentIntro'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Results = lazy(() => import('./pages/Results'));
const DeepAssessment = lazy(() => import('./pages/DeepAssessment'));
const DeepResults = lazy(() => import('./pages/DeepResults'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const Science = lazy(() => import('./pages/Science'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Profile = lazy(() => import('./pages/Profile'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-[#4f4634]">Loading...</div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  /* Landing - full layout (header + footer included in Landing page) */
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <Landing />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/:locale',
    element: (
      <SuspenseWrapper>
        <Landing />
      </SuspenseWrapper>
    ),
  },

  /* Dashboard (logged-in home) */
  {
    path: '/:locale/dashboard',
    element: (
      <SuspenseWrapper>
        <Dashboard />
      </SuspenseWrapper>
    ),
  },

  /* Assessment flow - minimal layout (no footer, handled by page itself) */
  {
    path: '/:locale/assessment/intro',
    element: (
      <SuspenseWrapper>
        <AssessmentIntro />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/:locale/assessment',
    element: (
      <SuspenseWrapper>
        <Assessment />
      </SuspenseWrapper>
    ),
  },

  /* Results */
  {
    path: '/:locale/results/:id',
    element: (
      <SuspenseWrapper>
        <Results />
      </SuspenseWrapper>
    ),
  },

  /* Deep assessment */
  {
    path: '/:locale/deep-assessment',
    element: (
      <SuspenseWrapper>
        <DeepAssessment />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/:locale/deep-results/:id',
    element: (
      <SuspenseWrapper>
        <DeepResults />
      </SuspenseWrapper>
    ),
  },

  /* Pricing */
  {
    path: '/:locale/pricing',
    element: (
      <SuspenseWrapper>
        <Pricing />
      </SuspenseWrapper>
    ),
  },

  {
    path: '/:locale/science',
    element: (
      <SuspenseWrapper>
        <Science />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/:locale/payment-success',
    element: (
      <SuspenseWrapper>
        <PaymentSuccess />
      </SuspenseWrapper>
    ),
  },

  /* Auth */
  {
    path: '/:locale/login',
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/:locale/signup',
    element: (
      <SuspenseWrapper>
        <SignUp />
      </SuspenseWrapper>
    ),
  },

  /* Profile */
  {
    path: '/:locale/profile',
    element: (
      <SuspenseWrapper>
        <Profile />
      </SuspenseWrapper>
    ),
  },
]);
