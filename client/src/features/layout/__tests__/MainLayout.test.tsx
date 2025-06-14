import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route,Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import MainLayout from './MainLayout';

// Mock child components to isolate the layout
vi.mock('@/features/navigation/components/Sidebar', () => ({
  Sidebar: (props: { isCollapsed: boolean }) => (
    <div data-testid="sidebar">Sidebar collapsed: {props.isCollapsed.toString()}</div>
  ),
}));

vi.mock('@/features/navigation/components/Topbar', () => ({
  Topbar: (props: { pageTitle?: string }) => (
    <div data-testid="topbar">{props.pageTitle || 'Painel'}</div>
  ),
}));

const TestComponent = () => <div>Test Page Content</div>;

describe('MainLayout', () => {
  it('renders Sidebar, Topbar, and Outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              path="test"
              element={<TestComponent />}
              handle={{ title: 'Test Page Title' }}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Check if Sidebar and Topbar are rendered
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();

    // Check if the dynamic title is passed to Topbar
    expect(screen.getByText('Test Page Title')).toBeInTheDocument();

    // Check if the Outlet content is rendered
    expect(screen.getByText('Test Page Content')).toBeInTheDocument();
  });

  it('renders default title when route has no handle', () => {
    render(
      <MemoryRouter initialEntries={['/no-handle']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="no-handle" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Check if Topbar renders the default title
    expect(screen.getByText('Painel')).toBeInTheDocument();
  });
});
