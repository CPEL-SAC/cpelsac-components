import { Input } from "@/components/ui/input"
import { IconCircleCheck, IconCircleX, IconSearch, IconClock } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect, useState } from "react"

export default function ClientSearch({ getClient, setClientData, searchText, setSearchText }) {
  const SEARCH_BY = {
    username: 'username',
    digitainClientId: 'digitainClientId'
  }
  const [searchBy, setSearchBy] = useState(SEARCH_BY.username)
  // const [searchText, setSearchText] = useState('')
  const [validClient, setValidClient] = useState('search')

  useEffect(() => {
    if (searchText) {
      setValidClient('search')
      const delayDebounceFn = setTimeout(() => {
        const numberClient = searchText;
        getClient({ searchBy, searchText: numberClient, setValidClient })
      }, 800)
      return () => clearTimeout(delayDebounceFn)
    } else {
      // si el campo de búsqueda está vacío
      setValidClient(false)
      setClientData(null)
    }
  }, [searchText, searchBy]) //eslint-disable-line

  return (
    <div className="mt-4">
      <div className="flex justify-end">
        <Select value={searchBy} onValueChange={setSearchBy} >
          <SelectTrigger className="w-[160px] bg-white dark:bg-[#020817] text-xs text-gray-500 h-6 mb-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SEARCH_BY.username}>Buscar por DNI</SelectItem>
            <SelectItem value={SEARCH_BY.digitainClientId}>Buscar por Código</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="search-field relative">
        <IconSearch size={20} className="absolute right-3 top-[10px]" />
        <Input
          type="text" 
          placeholder="Buscar cliente ..."  
          className={`w-full bg-white dark:bg-[#020817] rounded-full ${
            searchText
              ? validClient === 'search' ? 'border-blue-500' : validClient ? 'border-green-500' : 'border-red-500'
              : ''
          }`} 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          // min="60000000" 
          step={1}
          autoComplete="new-password" 
        />
          { searchText &&
            <div className={`${validClient === 'search' ? 'text-blue-700' : validClient ? 'text-green-700' : 'text-red-700'} font-extralight text-xs mt-1 ml-2`}>
              {
                validClient === 'search' ? <span className="inline-flex" ><IconClock className="mr-1 h-4 w-4" />Buscando...</span> : validClient ? <span className="inline-flex">
                <IconCircleCheck className="mr-1 h-4 w-4" />
                Cliente encontrado
              </span> : <span className="inline-flex">
                <IconCircleX className="mr-1 h-4 w-4" />
                Cliente incorrecto
              </span>
              }
            </div>
          }
      </div>
    </div>
  )
}
