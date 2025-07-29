import {ChevronLast, ChevronFirst,MoreVertical } from "lucide-react"
import React,{ useContext, createContext, useState } from "react"

const SidebarContext = createContext()
const logDetails = {
  Mname: "Alice",
  mail: "alice@gmail.com"
};


export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)
  
  return (
  <>
    <aside className="h-screen">
      <nav className={` {expanded ? "w-72 p-5" : "w-20 p-4"} bg-teal-950 border-r shadow-sm h-full`}>
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`overflow-hidden transition-all text-white ${
              expanded ? "w-32" : "w-0"
            }`}>
            Cashier Panel
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-teal-900 hover:bg-cyan-100 hover:text-black text-white"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

{/* login details */}
        <div className="border-t flex items-center p-3 text-white">
          <div className={`transition-all ${expanded ? "w-52 ml-3" : "w-0 overflow-hidden"}`}>
            <div className="leading-4">
              <h4 className="font-semibold">{logDetails.Mname}</h4>
              <span className="text-xs text-gray-300">{logDetails.mail}</span>
            </div>
          </div>
          {expanded && <MoreVertical size={20} className="ml-auto text-white" />}
        </div>
      </nav>
    </aside>
        </>
  )
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-gradient-to-tr from-green-200 to-green-100 text-amber-400"
          : "hover:bg-lime-100 hover:text-black text-white"}
      `}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-green-100 ${expanded ? "" : "top-2"}`} />
      )}
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-emerald-900 text-amber-400 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
