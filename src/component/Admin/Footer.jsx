import React from 'react'

export default function Footer() {
  return (
    <div>
        {/* Staff Alerts Footer */}
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

  {/* Material Low Stock → Red Border */}
  <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-red-500 lg:border-l-8 text-gray-800 min-h-[120px]">
    <div className="flex justify-between items-start mb-2">
      {/* Text on left */}
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-red-500 uppercase mb-1">Material Low Stock</span>
        <span className="text-sm font-normal text-gray-600 leading-relaxed">
          Cotton Fabric (15 units) and Zippers (8 units) are running low
        </span>
      </div>
      {/* Icon on right */}
      <img src="/asset/alert-filled-svgrepo-com.svg" alt="alert" className="h-10 w-10 ml-4 opacity-70" />
    </div>
  </div>

  {/* Production Delay → Orange Border */}
  <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-orange-500 lg:border-l-8 text-gray-800 min-h-[120px]">
    <div className="flex justify-between items-start mb-2">
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-orange-500 uppercase mb-1">Production Delay</span>
        <span className="text-sm font-normal text-gray-600 leading-relaxed">
          Batch #1237 Packing task is behind schedule - Due: Nov 6
        </span>
      </div>
      <img src="/asset/download-removebg-preview.png" alt="delay" className="h-10 w-10 ml-4 opacity-70" />
    </div>
  </div>

  {/* Inventory Alert → Purple Border */}
  <div className="relative overflow-hidden rounded-lg p-6 flex flex-col justify-between bg-white shadow-md border-l-4 border-purple-500 lg:border-l-8 text-gray-800 min-h-[120px]">
    <div className="flex justify-between items-start mb-2">
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-purple-500 uppercase mb-1">Inventory Alert</span>
        <span className="text-sm font-normal text-gray-600 leading-relaxed">
          Red Summer Dress (12) and Green Polo Shirt (8) need restocking
        </span>
      </div>
      <img src="/asset/box-minimalistic-svgrepo-com.svg" alt="supply" className="h-10 w-10 ml-4 opacity-70" />
    </div>
  </div>

</footer>

    </div>
  )
}
