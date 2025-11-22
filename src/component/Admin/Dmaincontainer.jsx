import React from 'react';
import Footer from '../Admin/Footer';

export default function Dmaincontainer() {
  return (
    <div>
      {/* Dashboard Content */}
      <div className="p-4 md:p-6 bg-[#eff1f9] ">
        {/* Dashboard Overview */}
        <section className="mb-6 md:mb-8">
          <h1 className="text-lg font-bold mb-2">Staff Dashboard Overview</h1>
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

        {/* My Recent Activities, Material Stock Distribution & Items Need Attention */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">

          {/* My Recent Activities */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-lg text-gray-800">My Recent Activities</h3>
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

              <div className="flex items-start gap-2 p-2 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">Updated <span className="font-medium text-gray-900">Blue Shirts</span></p>
                  <p className="text-sm text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Material Stock Distribution */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="font-semibold mb-4 text-lg">Material Stock Distribution</h3>
            <div className="space-y-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-2 font-medium text-sm text-gray-700">Stock Level</th>
                    <th className="text-right pb-2 font-medium text-sm text-gray-700">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                      <span className="text-gray-700">In Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#10B981] text-sm">4</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                      <span className="text-gray-700">Medium Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#F59E0B] text-sm">2</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                      <span className="text-gray-700">Low Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#EF4444] text-sm">2</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-[#6B7280]"></div>
                      <span className="text-gray-700">Out of Stock</span>
                    </td>
                    <td className="py-1 text-right text-base">
                      <span className="font-semibold text-[#6B7280] text-sm">0</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Items Need Attention */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="font-semibold mb-4 text-lg">Items Need Attention</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left font-medium text-sm">Item</th>
                    <th className="pb-2 text-right font-medium text-sm">Current</th>
                    <th className="pb-2 text-center font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 text-base">Cotton Fabric</td>
                    <td className="py-1 text-right text-base">15</td>
                    <td className="py-1 text-center"><span className="text-red-600 font-semibold text-sm">Low</span></td>
                  </tr>
                  <tr>
                    <td className="py-1 text-base">Zippers</td>
                    <td className="py-1 text-right text-base">8</td>
                    <td className="py-1 text-center"><span className="text-red-600 font-semibold text-sm">Low</span></td>
                  </tr>
                  <tr>
                    <td className="py-1 text-base">Red Dress</td>
                    <td className="py-1 text-right text-base">12</td>
                    <td className="py-1 text-center"><span className="text-red-600 font-semibold text-sm">Low</span></td>
                  </tr>
                  <tr>
                    <td className="py-1 text-base">Polo Shirt</td>
                    <td className="py-1 text-right text-base">8</td>
                    <td className="py-1 text-center"><span className="text-red-600 font-semibold text-sm">Low</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* My Assigned Tasks */}
        <section className="bg-white shadow rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="font-semibold mb-4 text-lg">My Assigned Tasks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-sm">Batch ID</th>
                  <th className="pb-2 font-medium text-sm">Task</th>
                  <th className="pb-2 font-medium text-sm">Assign Date</th>
                  <th className="pb-2 font-medium text-sm">Status</th>
                  <th className="pb-2 font-medium text-sm">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 text-base">#1234</td>
                  <td className="py-2 text-base">Cutting</td>
                  <td className="py-2 text-base">Nov 1</td>
                  <td className="py-2 text-base"><span className="text-green-600 font-semibold text-sm">On Track</span></td>
                  <td className="py-2 text-base">Nov 5</td>
                </tr>
                <tr>
                  <td className="py-2 text-base">#1236</td>
                  <td className="py-2 text-base">Quality Check</td>
                  <td className="py-2 text-base">Nov 2</td>
                  <td className="py-2 text-base"><span className="text-yellow-600 font-semibold text-sm">In Progress</span></td>
                  <td className="py-2 text-base">Nov 8</td>
                </tr>
                <tr>
                  <td className="py-2 text-base">#1237</td>
                  <td className="py-2 text-base">Packing</td>
                  <td className="py-2 text-base">Nov 3</td>
                  <td className="py-2 text-base"><span className="text-red-600 font-semibold text-sm">Delayed</span></td>
                  <td className="py-2 text-base">Nov 6</td>
                </tr>
                <tr>
                  <td className="py-2 text-base">#1238</td>
                  <td className="py-2 text-base">Ironing</td>
                  <td className="py-2 text-base">Nov 4</td>
                  <td className="py-2 text-base"><span className="text-gray-600 font-semibold text-sm">Pending</span></td>
                  <td className="py-2 text-base">Nov 10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Supplier Information Table */}
        <section className="bg-white shadow rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Supplier Information Overview</h3>
            <span className="text-sm text-gray-500">Active Suppliers</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-sm">Supplier</th>
                  <th className="pb-2 font-medium text-sm">Contact</th>
                  <th className="pb-2 font-medium text-sm">Material Name</th>
                  <th className="pb-2 font-medium text-sm">Quantity</th>
                  <th className="pb-2 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 text-base">
                    <div>
                      <div className="font-medium text-sm">Textile World Ltd.</div>
                      <div className="text-sm text-gray-500">#SUP001</div>
                    </div>
                  </td>
                  <td className="py-2 text-base">
                    <div>
                      <div className="text-sm">John Smith</div>
                      <div className="text-sm text-gray-500">textile@world.com</div>
                    </div>
                  </td>
                  <td className="py-2 text-base">Cotton Fabric</td>
                  <td className="py-2 text-base">500 yards</td>
                  <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span></td>
                </tr>
                {/* Additional suppliers ... */}
              </tbody>
            </table>
          </div>
        </section>

        {/* Staff Alerts Footer */}
        
        <Footer/>
      </div>
    </div>
  );
}
