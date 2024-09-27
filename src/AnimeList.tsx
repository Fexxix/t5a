import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input" // Assuming you have this component
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination" // Assuming you have these components
import { AnimeCard } from "./AnimeCard"
import { Checkbox } from "@/components/ui/checkbox"

type AnimeTitle = {
  romaji: string
  english: string | null
  native: string
  userPreferred: string
}

type Anime = {
  id: number
  title: AnimeTitle
  images: string[]
}

export default function AnimeList() {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [filteredAnimeList, setFilteredAnimeList] = useState<Anime[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterImages, setFilterImages] = useState(false)
  const [filterEmptyImages, setFilterEmptyImages] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Fetch data from the static JSON file located in the public folder
    fetch("/animeData.json")
      .then((res) => res.json())
      .then((data) => setAnimeList(data))
      .catch((error) => console.error("Error fetching anime data:", error))
  }, [])

  useEffect(() => {
    const filtered = animeList
      .filter((anime) => {
        // Apply filters based on checkboxes
        if (filterImages) {
          return anime.images.length > 0 // Only anime with images
        }
        if (filterEmptyImages) {
          return anime.images.length === 0 // Only anime with empty image array
        }
        return true // No image-based filtering
      })
      .filter(
        (anime) =>
          anime.title.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (anime.title.english &&
            anime.title.english
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          anime.title.native.toLowerCase().includes(searchTerm.toLowerCase()) ||
          anime.title.userPreferred
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    setFilteredAnimeList(filtered)
    setCurrentPage(1) // Reset to first page on filter change
  }, [animeList, searchTerm, filterImages, filterEmptyImages])

  const totalPages = Math.ceil(filteredAnimeList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAnimeList = filteredAnimeList.slice(startIndex, endIndex)

  const maxPaginationLinks = 5
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxPaginationLinks / 2),
      totalPages - maxPaginationLinks + 1
    )
  )
  const endPage = Math.min(startPage + maxPaginationLinks - 1, totalPages)

  return (
    <div className="container mx-auto p-4">
      <Input
        type="text"
        placeholder="Search anime..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Filter for Anime with Images */}
      <label htmlFor="filter-images" className="flex items-center mb-4">
        <Checkbox
          checked={filterImages}
          onCheckedChange={() => {
            setFilterImages(!filterImages)
            setFilterEmptyImages(false) // Ensure the other checkbox is unchecked
          }}
          name="filter-images"
          className="mr-2"
        />
        Only show anime with images
      </label>

      {/* Filter for Anime with Empty Image Array */}
      <label htmlFor="filter-empty-images" className="flex items-center mb-4">
        <Checkbox
          checked={filterEmptyImages}
          onCheckedChange={() => {
            setFilterEmptyImages(!filterEmptyImages)
            setFilterImages(false) // Ensure the other checkbox is unchecked
          }}
          name="filter-empty-images"
          className="mr-2"
        />
        Only show anime with empty image array
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {currentAnimeList.map((anime) => (
          <AnimeCard anime={anime} key={anime.id} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem className="cursor-pointer">
                  <PaginationLink onClick={() => setCurrentPage(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && <PaginationEllipsis />}
              </>
            )}

            {[...Array(endPage - startPage + 1)].map((_, index) => {
              const page = startPage + index
              return (
                <PaginationItem className="cursor-pointer" key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <PaginationEllipsis />}
                <PaginationItem className="cursor-pointer">
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
