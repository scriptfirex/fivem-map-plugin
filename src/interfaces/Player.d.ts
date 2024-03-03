import { Vehicle } from './Vehicle'

export interface Player {
    x: number
    y: number
    name: string
    vehicle: Vehicle | null
}
