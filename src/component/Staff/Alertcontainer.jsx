import React from 'react'

export default function Alertcontainer() {
  return (
    <div>
      {/* Alerts Content */}
      <section className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          </div>

          <div className="space-y-4">
            {/* Critical Alert */}
            <div className="bg-white rounded-lg border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-700">Critical: Low Stock Alert</h3>
                  <p className="text-gray-700 mt-1">Cotton Fabric stock is critically low (5 units remaining). Please notify supervisor immediately.</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      High Priority
                    </span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="bg-white rounded-lg border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-700">Task Deadline Approaching</h3>
                  <p className="text-gray-700 mt-1">Your assigned task for batch #1234 is due tomorrow. Current progress: 75%</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium Priority
                    </span>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-white rounded-lg border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-700">Scheduled Break</h3>
                  <p className="text-gray-700 mt-1">Lunch break scheduled from 12:00 PM to 1:00 PM. Please complete current tasks beforehand.</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Information
                    </span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Alert */}
            <div className="bg-white rounded-lg border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-700">Task Completed Successfully</h3>
                  <p className="text-gray-700 mt-1">Your cutting task for batch #1233 has been marked as completed. Great work!</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New Task Alert */}
            <div className="bg-white rounded-lg border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-700">New Task Assigned</h3>
                  <p className="text-gray-700 mt-1">You have been assigned a new quality check task for batch #1239. Check your tasks page for details.</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      New Assignment
                    </span>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-end">
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
          </div>
        </div>
        
      </section>
    </div>
  )
}
