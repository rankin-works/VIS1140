import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PresentationsPage from './pages/PresentationsPage';
import ProjectsPage from './pages/ProjectsPage';
import ResourcesPage from './pages/ResourcesPage';
import PresentationViewer from './components/PresentationViewer';

export default function App() {
  return (
    <Routes>
      {/* Presentation viewer - full screen, outside layout */}
      <Route path="/presentations/:id" element={<PresentationViewer />} />

      {/* Main layout with header */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/presentations" element={<PresentationsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Route>
    </Routes>
  );
}
