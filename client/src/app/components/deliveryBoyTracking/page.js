"use client"
import "leaflet/dist/leaflet.css"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"


const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false }
)

const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup), { ssr: false }
)

const Polyline = dynamic(
    () => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false }
)

const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false }
)

const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker), { ssr: false }
)



export default function DeliveryBoyTracking({ data }) {


    const deliveryBoyLat = data?.deliveryBoyLocation?.lat
    const deliveryBoyLon = data?.deliveryBoyLocation?.lon
    const customerLat = data?.customerLocation?.lat
    const customerLon = data?.customerLocation?.lon
      const [L, setL] = useState(null)

    useEffect(() => {
        import("leaflet").then((leaflet) => {
            setL(leaflet)
        })
    }, [])



   
     const deliveryBoyIcon = useMemo(() => {
        if (!L) return null

        return L.icon({
            iconUrl: "/scooter.png",
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        })
    }, [L])

    const customerIcon = useMemo(() => {
        if (!L) return null

        return L.icon({
            iconUrl: "/home.png",
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        })
    }, [L])

    if (
        !deliveryBoyLat ||
        !deliveryBoyLon ||
        !customerLat ||
        !customerLon ||
        !deliveryBoyIcon ||
        !customerIcon
    ) {
        return null
    }


    const path = [
        [deliveryBoyLat, deliveryBoyLon],
        [customerLat, customerLon]
    ]

    const center = [deliveryBoyLat, deliveryBoyLon]

    return (
        <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">

            <MapContainer className="w-full h-full"
                center={center} zoom={16}>

                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Marker */}
                    <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
                        <Popup>Delivery Boy</Popup>
                    </Marker>


                {/* Marker */}
                        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
                            <Popup>Customer</Popup>
                        </Marker>

                <Polyline positions={path} color="orange" weight={4}></Polyline>

            </MapContainer>

        </div>
    )
}