import React from 'react'
import Layout from 'components/UI/Layout/layout'
import AdminNavBar from 'components/UI/AdminNavbar/AdminNavBar'

import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <Layout role="Admin" Navbar={AdminNavBar}>
      <Outlet />
    </Layout>
  )
}

export default AdminLayout