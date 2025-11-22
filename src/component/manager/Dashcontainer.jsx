import React from 'react';
import Footer from './Footer';

export default function Dashcontainer() {
  return (
    <div>
      <div className="p-4 md:p-6 bg-[#eff1f9] min-h-screen">

        {/* Dashboard Overview */}
        <section className="mb-6 md:mb-8">
          <h1 className="text-lg font-bold mb-2">Manager Dashboard Overview</h1>
          <p className="text-sm text-gray-600 mb-4">Welcome back! Here's your current tasks and responsibilities.</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {/* Total Materials */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#5A4BCF" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#5A4BCF" }}>Total Materials</p>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm font-medium opacity-80">2 Low Stock</p>
                </div>
                <img src="/asset/box-minimalistic-svgrepo-com.svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>

            {/* Assigned Tasks */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#28A745" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#28A745" }}>Assigned Tasks</p>
                  <p className="text-3xl font-bold">4</p>
                  <p className="text-sm font-medium opacity-80">1 in progress, 1 delayed</p>
                </div>
                <img src="/asset/factory-svgrepo-com (1).svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>

            {/* Total Items */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#17A2B8" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#17A2B8" }}>Total Items</p>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm font-medium opacity-80">2 Low Stock</p>
                </div>
                <img src="/asset/box-check-svgrepo-com.svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>

            {/* Active Alerts */}
            <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 lg:border-l-8 text-gray-800" style={{ borderColor: "#FFC107" }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <p className="text-sm font-medium uppercase mb-1" style={{ color: "#FFC107" }}>Active Alerts</p>
                  <p className="text-3xl font-bold">5</p>
                  <p className="text-sm font-medium opacity-80">Need attention</p>
                </div>
                <img src="/asset/contract-pending-line-svgrepo-com.svg" className="h-12 w-12 ml-4 opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activities, Stock Distribution, Items Attention */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* My Recent Activities */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">My Recent Activities</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-2 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">Updated <span className="font-medium text-gray-900">Cotton Fabric</span> status</p>
                  <p className="text-sm text-gray-500 mt-1">5 mins ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">Completed <span className="font-medium text-gray-900">Cutting task</span></p>
                  <p className="text-sm text-gray-500 mt-1">25 mins ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Material Stock Distribution */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Material Stock Distribution</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-700">Stock Level</th>
                  <th className="text-right text-sm font-medium text-gray-700">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 text-base flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>In Stock</td>
                  <td className="py-1 text-base text-right"><span className="text-sm font-semibold text-green-500">4</span></td>
                </tr>
                <tr>
                  <td className="py-1 text-base flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Medium Stock</td>
                  <td className="py-1 text-base text-right"><span className="text-sm font-semibold text-yellow-500">2</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items Need Attention */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Items Need Attention</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium">Item</th>
                  <th className="text-right text-sm font-medium">Current</th>
                  <th className="text-center text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 text-base">Cotton Fabric</td>
                  <td className="py-1 text-base text-right">15</td>
                  <td className="py-1 text-base text-center"><span className="text-sm font-semibold text-red-600">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* My Assigned Tasks */}
        <section className="bg-white shadow rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg font-semibold mb-4">My Assigned Tasks</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-sm font-medium">Batch ID</th>
                <th className="text-sm font-medium">Task</th>
                <th className="text-sm font-medium">Assign Date</th>
                <th className="text-sm font-medium">Status</th>
                <th className="text-sm font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-base">#1234</td>
                <td className="py-2 text-base">Cutting</td>
                <td className="py-2 text-base">Nov 1</td>
                <td className="py-2 text-base"><span className="text-sm font-semibold text-green-600">On Track</span></td>
                <td className="py-2 text-base">Nov 5</td>
              </tr>
            </tbody>
          </table>
        </section>

        <Footer />
      </div>
    </div>
  );
}
