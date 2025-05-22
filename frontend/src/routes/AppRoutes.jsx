import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import NotFound from '../pages/NotFound'; 
import UserManagement from '../pages/UserManagement'
import Home from '../pages/home'
import CalendarExport from '../pages/CalendarExport'
import Dashboard from '../pages/Dashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/manage/user" element={<UserManagement />} />
      <Route path="/Calendar/Export" element={<CalendarExport />} />
      <Route path="/home" element={<Home />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
}