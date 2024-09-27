import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={anime.images[0] || "/placeholder.svg?height=200&width=150"}
          alt={anime.title.userPreferred}
          className="w-full h-48 object-cover mb-2 rounded"
        />
        <h2 className="text-lg font-semibold">{anime.title.userPreferred}</h2>
        {anime.title.english &&
          anime.title.english !== anime.title.userPreferred && (
            <p className="text-sm text-gray-600">{anime.title.english}</p>
          )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{anime.title.userPreferred}</DialogTitle>
            <DialogDescription>
              {anime.title.english &&
                anime.title.english !== anime.title.userPreferred && (
                  <p>{anime.title.english}</p>
                )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anime.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${anime.title.userPreferred} - Image ${index + 1}`}
                className="w-full h-48 object-cover rounded"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
