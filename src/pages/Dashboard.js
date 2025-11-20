import React, { useState, useEffect } from 'react'
import response from '../utils/demo/tableData'
import FilterPanel from '../components/FilterPanel'
import DashboardCards from '../components/DashboardCards'
import DashboardItems from '../components/DashboardItems'
import StudentQRCard from '../components/StudentQRCard'
import QuickLinks from '../components/QuickLinks'
import RegionalManagers from '../components/RegionalManagers'

function Dashboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-4 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Title and Subtitle */}
        <div>
          <h4 className="text-2xl md:text-md font-semibold text-gray-900">Dashboard</h4>
          <p className="text-sm md:text-sm text-gray-500 mt-1">Welcome to EduAnchor Portal</p>
        </div>

      </div>
    </div>

    <FilterPanel/>
    
      <DashboardItems/>
      <StudentQRCard/>
      <QuickLinks/>
      <RegionalManagers/>
    </>
  )
}

export default Dashboard
