import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route,Routes } from 'react-router-dom';

import { Sidebar } from '@/components/navigation/Sidebar'; // Actual Sidebar
import { Topbar } from '@/components/navigation/Topbar'; // Actual Topbar for realistic rendering

import MainLayout from './MainLayout';

const meta: Meta<typeof MainLayout> = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

// Mock a simple page component to be rendered by the Outlet
const DashboardPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Dashboard Content</h1>
    <p>This is a sample page rendered within the MainLayout.</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Settings Content</h1>
    <p>This is the settings page.</p>
  </div>
);

export const Default: Story = {
  render: () => (
    <MainLayout>
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
          handle={{ title: 'Painel Principal' }}
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
          handle={{ title: 'Configurações' }}
        />
      </Routes>
    </MainLayout>
  ),
};

export const WithDynamicTitle: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}> {/* Start on settings page */}
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  render: () => (
    <MainLayout>
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
          handle={{ title: 'Painel Principal' }}
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
          handle={{ title: 'Configurações Detalhadas' }} // Different title for this story
        />
      </Routes>
    </MainLayout>
  ),
};
