// import React from "react";
// import Container from "./Container";
// import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
// import { GiBarn, GiBoatFishing, GiCactus, GiCampingTent, GiCastle, GiCaveEntrance, GiIsland, GiWindmill } from "react-icons/gi";
// import { MdOutlineVilla } from "react-icons/md";
// import CategoryBox from "./CategoryBox";
// import { usePathname, useSearchParams } from "next/navigation";
// import { FaSkiing } from "react-icons/fa";
// import { BsSnow } from "react-icons/bs";
// import { IoDiamond } from "react-icons/io5";

// export const categories = [
//   {
//     label: "Beach",
//     icon: TbBeach,
//     description: "This property is close to the beach"
//   },
//     {
//     label: "Windmills",
//     icon: GiWindmill,
//     description: "This property has windmills!"
//   },
//     {
//     label: "mama",
//     icon: MdOutlineVilla,
//     description: "This property is modern"
//   },
//       {
//     label: "Countryside",
//     icon: TbMountain,
//     description: "This property is in the countryside!"
//   },
//         {
//     label: "Pools",
//     icon: TbPool,
//     description: "This property has a pool!"
//   },
//         {
//     label: "Island",
//     icon: GiIsland,
//     description: "This property is on an island!"
//   },
//         {
//     label: "Lake",
//     icon: GiBoatFishing,
//     description: "This property is closes to a lake!"
//   },
//         {
//     label: "Skiing",
//     icon: FaSkiing,
//     description: "This property has skiing activities!"
//   },
//         {
//     label: "Castle",
//     icon: GiCastle,
//     description: "This property is in a Castle!"
//   },
//         {
//     label: "Camping",
//     icon: GiCampingTent,
//     description: "This property has camping activities!"
//   },
//         {
//     label: "Arctic",
//     icon: BsSnow,
//     description: "This property is in snow!"
//   },
//         {
//     label: "Cave",
//     icon: GiCaveEntrance,
//     description: "This property is in a cave!"
//   },
//         {
//     label: "Desert",
//     icon: GiCactus,
//     description: "This property is in desert!"
//   },
//         {
//     label: "Barn",
//     icon: GiBarn,
//     description: "This property is in barn!"
//   },
//         {
//     label: "Lux",
//     icon: IoDiamond,
//     description: "This property is luxury!"
//   },
// ];

// const Categories = () => {
//   const params = useSearchParams()
  
//   const category = params?.get('category')
//   const pathName = usePathname()

//   const isMainPage = pathName === '/'//tra ve true false

//   if(!isMainPage){
//     return null
//   }

//   return (
//     <Container>
//       <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto scrollbar-hide scroll-smooth">
//         {categories.map((item,index) => (
//           <CategoryBox key={item.label} selected={category === item.label} label={item.label} description={item.description} icon={item.icon} tooltipPosition={index === categories.length -1 || index === categories.length-2 ? 'right' : 'left'}></CategoryBox>
//         ))}
//       </div>
//     </Container>
    
//   );
// };

// export default Categories;


"use client"

import { useRef, useState, useEffect } from "react"
import { TbBeach, TbMountain, TbPool } from "react-icons/tb"
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCampingTent,
  GiCastle,
  GiCaveEntrance,
  GiIsland,
  GiWindmill,
} from "react-icons/gi"
import { MdOutlineVilla, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import CategoryBox from "./CategoryBox"
import { usePathname, useSearchParams } from "next/navigation"
import { FaSkiing } from "react-icons/fa"
import { BsSnow } from "react-icons/bs"
import { IoDiamond } from "react-icons/io5"

export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "This property is close to the beach",
  },
  {
    label: "Windmills",
    icon: GiWindmill,
    description: "This property has windmills!",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "This property is modern",
  },
  {
    label: "Countryside",
    icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This property has a pool!",
  },
  {
    label: "Island",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property is close to a lake!",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "This property has skiing activities!",
  },
  {
    label: "Castle",
    icon: GiCastle,
    description: "This property is in a Castle!",
  },
  {
    label: "Camping",
    icon: GiCampingTent,
    description: "This property has camping activities!",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "This property is in snow!",
  },
  {
    label: "Cave",
    icon: GiCaveEntrance,
    description: "This property is in a cave!",
  },
  {
    label: "Desert",
    icon: GiCactus,
    description: "This property is in desert!",
  },
  {
    label: "Barn",
    icon: GiBarn,
    description: "This property is in barn!",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This property is luxury!",
  },
]

const Categories = () => {
  const params = useSearchParams()
  const category = params?.get("category")
  const pathName = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Check if we're on the main page
  const isMainPage = pathName === "/"

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && isMainPage) {
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll)
        // Check initial state
        handleScroll()

        return () => {
          scrollContainer.removeEventListener("scroll", handleScroll)
        }
      }
    }
  }, [isMounted, isMainPage])

  if (!isMounted) {
    return null
  }

  // Handle scroll buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 320 // Adjust this value as needed

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  // Update arrow visibility based on scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-3">
      <div className="relative pt-1">
        {/* Left scroll button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition"
            aria-label="Scroll left"
          >
            <MdKeyboardArrowLeft size={24} />
          </button>
        )}

        {/* Categories container */}
        <div
          ref={scrollContainerRef}
          className="flex flex-row items-center justify-between overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          {categories.map((item, index) => (
            <CategoryBox
              key={item.label}
              selected={category === item.label}
              label={item.label}
              description={item.description}
              icon={item.icon}
              tooltipPosition={index === categories.length - 1 || index === categories.length - 2 ? "right" : "left"}
            />
          ))}
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition"
            aria-label="Scroll right"
          >
            <MdKeyboardArrowRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Categories
