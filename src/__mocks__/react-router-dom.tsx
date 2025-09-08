import React from 'react';

// Mock for useNavigate
export const useNavigate = () => jest.fn();

// Mock for useLocation
export const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null
});

// Mock for useParams
export const useParams = () => ({});

// Mock for Link component
export const Link = ({ children, to, ...props }: any) => (
  <a href={to} {...props}>
    {children}
  </a>
);

// Mock for NavLink component
export const NavLink = ({ children, to, ...props }: any) => (
  <a href={to} {...props}>
    {children}
  </a>
);

// Mock for Route component
export const Route = ({ children, ...props }: any) => (
  <div {...props}>
    {children}
  </div>
);

// Mock for Routes component
export const Routes = ({ children, ...props }: any) => (
  <div {...props}>
    {children}
  </div>
);

// Mock for Navigate component
export const Navigate = ({ to, ...props }: any) => (
  <div data-testid="navigate" data-to={to} {...props} />
);

// Mock for useSearchParams
export const useSearchParams = () => [new URLSearchParams(), jest.fn()];

// Mock for BrowserRouter
export const BrowserRouter = ({ children, ...props }: any) => (
  <div {...props}>
    {children}
  </div>
);

// Mock for HashRouter
export const HashRouter = ({ children, ...props }: any) => (
  <div {...props}>
    {children}
  </div>
);

// Mock for MemoryRouter
export const MemoryRouter = ({ children, ...props }: any) => (
  <div {...props}>
    {children}
  </div>
);

// Mock for Outlet
export const Outlet = () => <div data-testid="outlet" />;

// Mock for useOutlet
export const useOutlet = () => null;

// Mock for useOutletContext
export const useOutletContext = () => ({});

// Mock for useResolvedPath
export const useResolvedPath = (to: any) => ({ pathname: to, search: '', hash: '' });

// Mock for useMatch
export const useMatch = () => null;

// Mock for useRoutes
export const useRoutes = (_routes: any) => null;

// Mock for generatePath
export const generatePath = (path: string, _params: any = {}) => path;

// Mock for matchPath
export const matchPath = () => null;

// Mock for resolvePath
export const resolvePath = (to: any, _from?: any) => ({ pathname: to, search: '', hash: '' });

// Mock for createSearchParams
export const createSearchParams = (init?: any) => new URLSearchParams(init);

// Mock for UNSAFE_enhanceManualRouteObjects
export const UNSAFE_enhanceManualRouteObjects = (routes: any) => routes;

// Mock for UNSAFE_DataRouterContext
export const UNSAFE_DataRouterContext = React.createContext(null);

// Mock for UNSAFE_DataRouterStateContext
export const UNSAFE_DataRouterStateContext = React.createContext(null);

// Mock for UNSAFE_NavigationContext
export const UNSAFE_NavigationContext = React.createContext(null);

// Mock for UNSAFE_RouteContext
export const UNSAFE_RouteContext = React.createContext(null);

// Mock for UNSAFE_useRouteId
export const UNSAFE_useRouteId = () => '';

// Mock for UNSAFE_useFetcher
export const UNSAFE_useFetcher = () => ({
  data: undefined,
  state: 'idle',
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  load: jest.fn(),
  submit: jest.fn()
});

// Mock for UNSAFE_useFetchers
export const UNSAFE_useFetchers = () => [];

// Mock for UNSAFE_useViewTransitionState
export const UNSAFE_useViewTransitionState = () => false;

// Mock for UNSAFE_useBlocker
export const UNSAFE_useBlocker = () => false;

// Mock for UNSAFE_usePrompt
export const UNSAFE_usePrompt = () => {};

// Mock for UNSAFE_useBeforeUnload
export const UNSAFE_useBeforeUnload = () => {};

// Mock for UNSAFE_useDataRouterContext
export const UNSAFE_useDataRouterContext = () => ({});

// Mock for UNSAFE_useDataRouterState
export const UNSAFE_useDataRouterState = () => ({});

// Mock for UNSAFE_useActionData
export const UNSAFE_useActionData = () => undefined;

// Mock for UNSAFE_useLoaderData
export const UNSAFE_useLoaderData = () => undefined;

// Mock for UNSAFE_useRouteError
export const UNSAFE_useRouteError = () => new Error('Mock route error');

// Mock for UNSAFE_useNavigation
export const UNSAFE_useNavigation = () => ({
  state: 'idle',
  location: { pathname: '/', search: '', hash: '', state: null }
});

// Mock for UNSAFE_useRevalidator
export const UNSAFE_useRevalidator = () => ({
  state: 'idle',
  revalidate: jest.fn()
});

// Mock for UNSAFE_useRouteLoaderData
export const UNSAFE_useRouteLoaderData = () => undefined;

// Mock for UNSAFE_useMatches
export const UNSAFE_useMatches = () => [];

// Mock for UNSAFE_useShouldRevalidate
export const UNSAFE_useShouldRevalidate = () => false; 