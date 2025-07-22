import React from 'react'
import { Navigate, Outlet } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
