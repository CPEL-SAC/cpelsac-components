import { useState, useRef } from "react";
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import algoliasearch from "algoliasearch/lite"

let timeoutId = null

function MyAutocomplete({
  value,
  setValue,
  setID,
  isDisabled = false,
  placeholder = "Buscar ...",
  algoliaApplicationId,
  algoliaSearchApiKey,
  algoliaIndex
}) {
  const algoliaClient = algoliasearch(algoliaApplicationId, algoliaSearchApiKey)
  const algoliaAgentsIndex = algoliaClient.initIndex(algoliaIndex)
  const ListEl = useRef(null);
  const [showList, setShowList] = useState(false);
  const [listToShow, setListToShow] = useState([])
  const [activeSuggestion, setActiveSuggestion] = useState(0)

  const getAgents = async (val) => {
    if (val && val.length >= 3) {
      const { hits } = await algoliaAgentsIndex.search(val, {
        hitsPerPage: 10
      })
      // console.log(hits)
      // ignoramos los agentes con enabled === false
      const agentsOptions = hits
        .map(agent => ({
          id: agent.objectID,
          key: agent.objectID,
          // title: agent.name + ' (' + agent.codigoApuestonVIP + ')',
          title: agent.name,
          nombre: agent.name,
          codigoApuestonVIP: agent.codigoApuestonVIP
        }))

      setListToShow(agentsOptions)
      setShowList(!!agentsOptions.length)
    }
  }

  function handleChange(e) {
    setValue(e.target.value);
    if (e.target.value !== '') {
      // Cancela el timeout anterior si existe
      clearTimeout(timeoutId);
      // Establece un nuevo timeout para llamar a getAgents después de 500 milisegundos
      timeoutId = setTimeout(() => {
        // Llama a getAgents() aquí
        getAgents(e.target.value)
      }, 500);
    } else {
      setID('')
      setShowList(false);
    }
  }

  function handleClick(key, title) {
    setValue(title);
    try {
      setID(key);
    } catch {
      //
    }
    setShowList(false);
    setActiveSuggestion(0);
  }

  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      try {
        setValue(listToShow[activeSuggestion].title);
        setID(listToShow[activeSuggestion].key);
      } catch {
        //
      }
      setActiveSuggestion(0);
      setShowList(false);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    } else if (e.keyCode === 40) {
      // Esto debería ser -1, pero entre que empieza por 0 y que el estado va asyncrono hay que darle esta vuelta:
      if (activeSuggestion + 1 === listToShow.length) {
        return;
      }
      setShowList(true);
      setActiveSuggestion(activeSuggestion + 1);
    }
  }

  return (
    <div className="relative w-full" onKeyDown={handleKeyDown}>
      <Input
        type="search"
        placeholder={placeholder}
        className="mt-0 py-2 px-4 bg-white dark:bg-slate-900"
        onChange={handleChange}
        value={value}
        disabled={isDisabled}
      />
      <Card
        ref={ListEl}
        className="relative rounded-md z-10 w-full shadow-md border mt-1 overflow-hidden"
        style={{ display: showList ? "block" : "none" }}
      >
        <ul>
          {listToShow.map((l, index) => 
              <li
                className={`px-3 py-2 border-b text-xs hover:cursor-pointer hover:bg-blue-100 ${
                  index === activeSuggestion && 'bg-blue-300'}`}
                key={l.key}
                onClick={() => handleClick(l.key, l.title)}
              >
                {l.title}
              </li> // {`${l.title}${l.numero && ` (${l.numero})`}`}
            )
          }
        </ul>
      </Card>
    </div>
  );
}

export default MyAutocomplete
