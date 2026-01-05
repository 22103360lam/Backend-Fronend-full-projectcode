import React, { useState, useEffect } from 'react'
import Addalert from '../Adminpages/Addalert'
import axios from 'axios'
import { useAuth } from '../../AuthContext'

export default function Alertcontainer() {
 // getting role for conditional rendering
  const { user } = useAuth();
  const role = user?.role;

  const [showModal, setShowModal] = useState(false)

  // Manual alerts (added from modal) + auto low-stock alerts
  const [alerts, setAlerts] = useState([])
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  // Load low-stock materials AND in-stock inventory, build auto alerts
  useEffect(() => {
    let mounted = true
    const loadAlerts = async () => {
      try {
        // Get material alerts from localStorage (created by dashboard)
        const storedAlerts = localStorage.getItem('materialAlerts')
        const materialAlerts = storedAlerts ? JSON.parse(storedAlerts) : []

        const materialAutoAlerts = materialAlerts.map(alert => {
          const isCritical = alert.status === 'critical stock'
          return {
            id: alert.id,
            auto: true,
            type: isCritical ? 'critical' : 'warning',
            title: isCritical ? 'Critical Stock Alert' : 'Low Stock Alert',
            message: `${alert.materialName} is ${alert.status}`,
            priority: isCritical ? 'Critical' : 'High',
            icon: 'warning',
            borderColor: isCritical ? 'border-red-700' : 'border-yellow-500',
            bgColor: isCritical ? 'bg-red-200' : 'bg-yellow-100',
            textColor: isCritical ? 'text-red-700' : 'text-yellow-600',
            titleColor: isCritical ? 'text-red-800' : 'text-yellow-700',
            badgeColor: isCritical ? 'bg-red-200 text-red-900' : 'bg-yellow-100 text-yellow-800',
            timestamp: alert.timestamp
          }
        })

        // Get task alerts from localStorage (created by production)
        const storedTaskAlerts = localStorage.getItem('taskAlerts')
        const taskAlerts = storedTaskAlerts ? JSON.parse(storedTaskAlerts) : []

        const taskAutoAlerts = taskAlerts.map(alert => {
          const isFinished = alert.status === 'task finished'
          return {
            id: alert.id,
            auto: true,
            type: 'info',
            title: isFinished ? 'Task Finished' : 'Task Assignment',
            message: isFinished 
              ? `${alert.taskName} (task) is finished`
              : `${alert.taskName} (task) is assigned to ${alert.userName}`,
            priority: 'Medium',
            icon: isFinished ? 'check' : 'info',
            borderColor: isFinished ? 'border-green-500' : 'border-blue-500',
            bgColor: isFinished ? 'bg-green-100' : 'bg-blue-100',
            textColor: isFinished ? 'text-green-600' : 'text-blue-600',
            titleColor: isFinished ? 'text-green-700' : 'text-blue-700',
            badgeColor: isFinished ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800',
            hidePriority: true,
            timestamp: alert.timestamp
          }
        })

        if (mounted) {
          setAlerts(prev => {
            const manual = prev.filter(a => !a.auto)
            return [...materialAutoAlerts, ...taskAutoAlerts, ...manual]
          })
        }
      } catch (e) {
        console.error('Failed to load alerts', e)
      }
    }

    loadAlerts()
    
    // Listen for material alerts updates from dashboard
    const handleAlertsUpdate = () => loadAlerts()
    window.addEventListener('material-alerts-updated', handleAlertsUpdate)
    window.addEventListener('task-alerts-updated', handleAlertsUpdate)
    
    const t = setInterval(loadAlerts, 30000) // optional refresh
    return () => { 
      mounted = false
      clearInterval(t)
      window.removeEventListener('material-alerts-updated', handleAlertsUpdate)
      window.removeEventListener('task-alerts-updated', handleAlertsUpdate)
    }
  }, [])

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  // Remove any alert (manual or auto) by id
  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }

  const handleAddAlert = (newAlert) => {
    const nextId = alerts.length ? Math.max(...alerts.filter(a => !a.auto).map(a => Number(a.id) || 0)) + 1 : 1
    let borderColor='border-gray-500', bgColor='bg-gray-100', textColor='text-gray-600', titleColor='text-gray-700', badgeColor='bg-gray-100 text-gray-800', icon='info'
    switch (newAlert.priority.toLowerCase()) {
      case 'low':     borderColor='border-blue-500';   bgColor='bg-blue-100';   textColor='text-blue-600';   titleColor='text-blue-700';   badgeColor='bg-blue-100 text-blue-800'; break
      case 'medium':  borderColor='border-yellow-500'; bgColor='bg-yellow-100'; textColor='text-yellow-600'; titleColor='text-yellow-700'; badgeColor='bg-yellow-100 text-yellow-800'; break
      case 'high':    borderColor='border-red-500';    bgColor='bg-red-100';    textColor='text-red-600';    titleColor='text-red-700';    badgeColor='bg-red-100 text-red-800'; break
      case 'critical':borderColor='border-red-700';    bgColor='bg-red-200';    textColor='text-red-700';    titleColor='text-red-800';    badgeColor='bg-red-200 text-red-900'; break
      default: break
    }
    const alertObj = {
      id: nextId,
      type: newAlert.priority,
      title: `${newAlert.priority}: ${newAlert.alertType}`,
      message: newAlert.message,
      priority: newAlert.priority,
      icon,
      borderColor, bgColor, textColor, titleColor, badgeColor,
      relatedItem: newAlert.relatedItem,
      assignTo: newAlert.assignTo,
      dueDate: newAlert.dueDate
    }
    setAlerts(prev => [...prev.filter(a => a.auto), ...prev.filter(a => !a.auto), alertObj])
    closeModal()
  }

  const getIcon = (iconType) => {
    switch(iconType) {
      case 'warning': return (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />)
      case 'info':    return (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />)
      case 'check':   return (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />)
      default:        return (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 0 0118 0z" />)
    }
  }

  // Pagination logic
  const sortedAlerts = [...alerts].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
    return timeB - timeA // newest first
  })
  
  const totalPages = Math.max(1, Math.ceil(sortedAlerts.length / itemsPerPage))
  const indexOfLastAlert = currentPage * itemsPerPage
  const indexOfFirstAlert = indexOfLastAlert - itemsPerPage
  const currentAlerts = sortedAlerts.slice(indexOfFirstAlert, indexOfLastAlert)

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div>
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
             {(role === "Admin") && (
            <div className="flex items-center space-x-3">
              <button 
                onClick={openModal} 
                className="bg-[#6C5CE7] hover:bg-[#5949D5] text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Alert</span>
              </button>
            </div>
             )}
          </div>

          {showModal && <Addalert closeModal={closeModal} addAlert={handleAddAlert} />}

          <div className="space-y-4">
            {currentAlerts.length > 0 ? (
              currentAlerts.map((alert) => (
                <div key={alert.id} className={`bg-white rounded-lg border-l-4 ${alert.borderColor} shadow-md hover:shadow-lg transition-shadow p-6`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 ${alert.bgColor} rounded-full flex items-center justify-center`}>
                      <svg className={`w-6 h-6 ${alert.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getIcon(alert.icon)}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${alert.titleColor}`}>{alert.title}</h3>
                         {(role === "Admin" || role === "Manager") && (
                        <button 
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Alert"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                         )}
                      </div>
                      
                      <p className="text-base text-gray-700 mt-1">{alert.message}</p>
                      
                      {/* Display timestamp */}
                      {alert.timestamp && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(alert.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      
                      {!alert.hidePriority && (
                        <div className="flex items-center justify-between mt-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${alert.badgeColor}`}>
                            {alert.priority}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                <p className="text-base text-gray-500">All alerts have been cleared or no new alerts have been created.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedAlerts.length > itemsPerPage && (
            <div className="mt-6 flex justify-center space-x-2">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button 
                  key={idx + 1} 
                  onClick={() => goToPage(idx + 1)} 
                  className={`px-3 py-2 rounded-md text-sm ${
                    currentPage === idx + 1 
                      ? 'bg-[#6C5CE7] text-white' 
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
