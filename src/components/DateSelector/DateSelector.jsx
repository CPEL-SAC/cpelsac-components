import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PREDEFINED_DATE_RANGES } from "../config/constants"
import { IconCalendar } from "@tabler/icons-react";
import { toast } from "sonner";

function DateSelector({
  defaultRange = PREDEFINED_DATE_RANGES.today,
  startDate, endDate, setStartDate, setEndDate, disabled = false, dateTime = new Date()
}) {
  const [range, setRange] = useState(defaultRange)
  const [dates, setDates] = useState({
    from: startDate,
    to: endDate
  })
  const [open, setOpen] = useState(true)

  const updateRange = () => {
    // configuramos las fechas en función del rango seleccionado
    const now = new Date(dateTime)
    let tempStartDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    let tempEndDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59
    )
    switch (range) {
      case PREDEFINED_DATE_RANGES.today:
        // fechas: hoy 0:0 y hoy 23:59
        // ya esta puesto por defecto
        break
      case PREDEFINED_DATE_RANGES.yesterday:
        // fechas: fecha-1 0:0 y fecha-1 23:59
        tempStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        )
        tempEndDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          23, 59, 59
        )
        break
      case PREDEFINED_DATE_RANGES.dayBeforeYesterday:
        // fechas: fecha-2 0:0 y fecha-2 23:59
        tempStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2
        )
        tempEndDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          23, 59, 59
        )
        break
      case PREDEFINED_DATE_RANGES.lastSevenDays:
        // fechas: fecha-6 0:0 y hoy 23:59
        tempStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 6
        )
        // la fecha final ya esta por defecto
        break
      case PREDEFINED_DATE_RANGES.lastThirtyDays:
        // fechas: fecha-29 0:0 y hoy 23:59
        tempStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 29
        )
        // la fecha final ya esta por defecto
        break
      case PREDEFINED_DATE_RANGES.thisMonth:
        // fechas este mes dia 1 0:0 y hoy 23:59
        tempStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        )
        // la fecha final ya esta por defecto
        break
      case PREDEFINED_DATE_RANGES.lastMonth:
        // mes pasado, desde dia 1 0:0 hasta último dia del mes 23:59
        tempStartDate = new Date(
          now.getMonth() === 0 
            ? now.getFullYear() - 1 
            : now.getFullYear(), // si es enero ponemos el año pasado
          now.getMonth() === 0 
            ? 11 
            : now.getMonth() - 1, // si es enero ponemos diciembre
          1
        )
        tempEndDate = new Date(
          now.getMonth() === 0 
            ? now.getFullYear() - 1 
            : now.getFullYear(), // si es enero ponemos el año pasado
          now.getMonth() === 0 
            ? 12 
            : now.getMonth(), // si es enero ponemos diciembre, COMO ESTAMOS PONIENDO EL ULTIMO DIA DEL MES ANTERIOR O PONEMOS QUE SEA EL MES ANTERIOR AQUI
          0, // el día cero es el último día del mes ANTERIOR y se adapta al mes que sea
          23, 59, 59
        )
        break
      default:
    }

    if (range !== PREDEFINED_DATE_RANGES.select) {
      tempStartDate.setHours(0)
      tempStartDate.setMinutes(0)
      tempStartDate.setSeconds(0)
      tempEndDate.setHours(23)
      tempEndDate.setMinutes(59)
      tempEndDate.setSeconds(59)
      setDates({
        from: tempStartDate,
        to: tempEndDate
      })
      setStartDate(tempStartDate)
      setEndDate(tempEndDate)
    }
  }

  const updateDates = () => {
    const datesDiffMilliseconds = dates.to - dates.from
    const daysDiff = Math.ceil(datesDiffMilliseconds / (1000 * 60 * 60 * 24))
    if (daysDiff < 0) {
      toast.warning('El rango de fechas no es válido')
      return
    }
    if (daysDiff > 31) {
      toast.warning('El rango de fechas es demasiado largo, no pongas más de un mes.')
      return
    }
    
    dates.from.setHours(0)
    dates.from.setMinutes(0)
    dates.from.setSeconds(0)
    dates.to.setHours(23)
    dates.to.setMinutes(59)
    dates.to.setSeconds(59)

    setStartDate(dates.from)
    setEndDate(dates.to)
    setOpen(false)
  }
  
  useEffect(() => {
    updateRange()
  }, [range]) // eslint-disable-line

  return (
    <div className='flex gap-1 max-2-[100%] flex-wrap'>
      <Select value={range} onValueChange={setRange} disabled={disabled} >
        <SelectTrigger className="w-[150px] text-gray-500 bg-white dark:bg-black mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          { Object.entries(PREDEFINED_DATE_RANGES).map(([key, value]) =>
            <SelectItem key={key} value={value}>{value}</SelectItem>
          )}
        </SelectContent>
      </Select>

      { range === PREDEFINED_DATE_RANGES.select &&
        <div className="grid gap-2" >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`justify-start text-left mt-2 ${!dates?.from && 'text-muted-foreground'}`}
                disabled={disabled}
              >
                <IconCalendar className="mr-2 h-4 w-4" />
                { dates?.from 
                    ? dates?.to 
                      ? <>
                          {format(dates?.from, "dd LLL y", { locale: es })} -{" "}
                          {format(dates?.to, "dd LLL y", { locale: es })}
                        </>
                      : format(dates?.from, "dd LLL y", { locale: es })
                    : <span>Selecciona fechas</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 text-xs" align="start">
              <div className="calendar-footer w-full flex pt-2 pr-3 justify-end">
                <Button onClick={updateDates}>
                  Aceptar
                </Button>
              </div>
              <Calendar
                locale={es}
                initialFocus
                weekStartsOn={1}
                mode="range"
                defaultMonth={dates?.from}
                selected={dates}
                onSelect={setDates}
                numberOfMonths={2}
                disabled={disabled}
                styles={{
                  day: { fontSize: '0.7rem', marginTop: '0', height: '28px'}
                  // caption: { color: 'red' }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      }
    </div>
  )
}

export default DateSelector