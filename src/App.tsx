import { MapContainer, TileLayer, Polygon, Tooltip, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import wellknown from "wellknown";
import acrelandia from "./mocks/acrelandia.json";
import { useEffect, useState } from "react";
import { imoveisAcrelandia } from "./mocks/imoveis_acrelandia";
import { reservaLegalAcrelandia } from "./mocks/reserva_legal_acrelandia";

export default function App() {
    const [imoveis, setImoveis] = useState<any[]>([]);
    const [reserva, setReserva] = useState<any[]>([]);
    const [municipio, setMunicipio] = useState<any>(null);


    const [showMunicipio, setShowMunicipio] = useState(true);
    const [showImoveis, setShowImoveis] = useState(true);
    const [showReserva, setShowReserva] = useState(false);
    // const [showPoligonoAvulso, setShowPoligonoAvulso] = useState(true);

    useEffect(() => {
        setMunicipio(acrelandia);

        Papa.parse(imoveisAcrelandia.trim(), {
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (result) => {
                const parsed = result.data as any[];
                const polys = parsed.flatMap((item, index) => { // Adicione 'index' para identificar
                    try {
                        const geo = wellknown(item.geometria);

                        let coordinates;
                        // Lidar com diferentes tipos de geometria
                        if (geo.type === 'Polygon') {
                            // Para Polygon simples
                            const coordinates = geo.coordinates[0].map(([lng, lat]) => [lat, lng]);
                            return [{
                                id: item.cd_imovel,
                                municipio: item.ds_municipio,
                                cd_imovel: item.cd_imovel,
                                area: item.vlr_area_calculada,
                                coordinates: coordinates,
                            }];
                        } else if (geo.type === 'MultiPolygon') {
                            // Para MultiPolygon, processamos cada polígono individualmente
                            return geo.coordinates.map((polygonCoords, polyIndex) => {
                                const coordinates = polygonCoords[0].map(([lng, lat]) => [lat, lng]);
                                return {
                                    id: `${item.cd_imovel} - imovel ${polyIndex}`,
                                    municipio: `${item.ds_municipio} - imovel ${polyIndex}`,
                                    cd_imovel: `${item.cd_imovel} - imovel ${polyIndex}`,
                                    area: item.vlr_area_calculada,
                                    coordinates: coordinates,
                                };
                            });
                        } else if (geo.type === 'LineString') {
                            // Se for LineString, as coordenadas são diretas
                            coordinates = geo.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
                        } else if (geo.type === 'Point') {
                            // Ponto não tem múltiplos anéis, não é um polígono para Polygon
                            console.warn(`Item ${index}: Found Point geometry, skipping for Polygon rendering.`);
                            return null; // Retorna null para este item, será filtrado depois
                        } else {
                            console.warn(`Item ${index}: Unknown or unsupported geometry type: ${geo.type}`);
                            return null; // Retorna null para este item
                        }

                        if (!coordinates) {
                            console.error(`Item ${index}: Coordinates are null or undefined after processing geometry.`);
                            return null; // Garante que itens sem coordenadas válidas sejam pulados
                        }

                        return {
                            id: item.cd_imovel + " - imóvel",
                            municipio: item.ds_municipio + " - imóvel",
                            cd_imovel: item.cd_imovel + " - imóvel",
                            area: item.vlr_area_calculada,
                            coordinates: coordinates,
                        };
                    } catch (parseError) {
                        console.error(`Error parsing WKT for item ${index}:`, item.geometria_nova, parseError);
                        return null; // Retorna null para itens com erro de parsing
                    }
                }).filter(item => item !== null); // Filtra quaisquer itens que retornaram null

                setImoveis(polys);
            },
        });

        Papa.parse(reservaLegalAcrelandia.trim(), {
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            complete: (result) => {
                const parsed = result.data as any[];
                const polys = parsed.flatMap((item, index) => { // Adicione 'index' para identificar
                    try {
                        const geo = wellknown(item.geometria_nova);

                        let coordinates;
                        // Lidar com diferentes tipos de geometria
                        if (geo.type === 'Polygon') {
                            // Para Polygon, coordinates[0] é o anel exterior
                            const coordinates = geo.coordinates[0].map(([lng, lat]) => [lat, lng]);
                            return [{
                                id: item.cd_imovel,
                                municipio: item.ds_municipio,
                                cd_imovel: item.cd_imovel,
                                area: item.vlr_area_calculada,
                                coordinates: coordinates,
                            }];
                        } else if (geo.type === 'MultiPolygon') {
                            // Para MultiPolygon, processamos cada polígono individualmente
                            return geo.coordinates.map((polygonCoords, polyIndex) => {
                                const coordinates = polygonCoords[0].map(([lng, lat]) => [lat, lng]);
                                return {
                                    id: `${item.cd_imovel} - reserva ${polyIndex}`,
                                    municipio: `${item.ds_municipio} - reserva ${polyIndex}`,
                                    cd_imovel: `${item.cd_imovel} - reserva ${polyIndex}`,
                                    area: item.vlr_area_calculada,
                                    coordinates: coordinates,
                                };
                            });
                        } else if (geo.type === 'LineString') {
                            // Se for LineString, as coordenadas são diretas
                            coordinates = geo.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
                        } else if (geo.type === 'Point') {
                            // Ponto não tem múltiplos anéis, não é um polígono para Polygon
                            console.warn(`Item ${index}: Found Point geometry, skipping for Polygon rendering.`);
                            return null; // Retorna null para este item, será filtrado depois
                        } else {
                            console.warn(`Item ${index}: Unknown or unsupported geometry type: ${geo.type}`);
                            return null; // Retorna null para este item
                        }

                        if (!coordinates) {
                            console.error(`Item ${index}: Coordinates are null or undefined after processing geometry.`);
                            return null; // Garante que itens sem coordenadas válidas sejam pulados
                        }

                        return {
                            id: item.cd_imovel + " - reserva",
                            municipio: item.ds_municipio + " - reserva",
                            cd_imovel: item.cd_imovel + " - reserva",
                            area: item.vlr_area_calculada,
                            coordinates: coordinates,
                        };
                    } catch (parseError) {
                        console.error(`Error parsing WKT for item ${index}:`, item.geometria_nova, parseError);
                        return null; // Retorna null para itens com erro de parsing
                    }
                }).filter(item => item !== null); // Filtra quaisquer itens que retornaram null

                setReserva(polys); // Setar todos os polígonos válidos
            },
        })
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Visualização de Imóveis Rurais em Acrelândia</h1>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Painel de Controle */}
                        <div className="bg-gray-50 p-4 border-b md:border-b-0 md:border-r border-gray-200 md:w-64">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Controles do Mapa</h2>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showMunicipio"
                                        checked={showMunicipio}
                                        onChange={() => setShowMunicipio(!showMunicipio)}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="showMunicipio" className="ml-2 block text-sm text-gray-700">
                                        Mostrar Município
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showImoveis"
                                        checked={showImoveis}
                                        onChange={() => setShowImoveis(!showImoveis)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="showImoveis" className="ml-2 block text-sm text-gray-700">
                                        Mostrar Imóveis Rurais
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showReserva"
                                        checked={showReserva}
                                        onChange={() => setShowReserva(!showReserva)}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="showReserva" className="ml-2 block text-sm text-gray-700">
                                        Mostrar Áreas de reserva
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Legenda</h3>
                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-red-500 opacity-20 mr-2"></div>
                                    <span className="text-xs text-gray-600">Município</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-blue-500 opacity-30 mr-2"></div>
                                    <span className="text-xs text-gray-600">Imóveis Rurais</span>
                                </div>

                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-green-500 opacity-30 mr-2"></div>
                                    <span className="text-xs text-gray-600">Áreas de Reserva</span>
                                </div>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div className="flex-1 h-[600px]">
                            <MapContainer
                                center={[-9.96783, -66.67577]}
                                zoom={9}
                                className="w-full h-full"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* GeoJSON - Camada inferior */}
                                {municipio && showMunicipio && (
                                    <GeoJSON
                                        key={`municipio-${showMunicipio}`}
                                        data={municipio}
                                        style={{
                                            fillColor: 'red',
                                            weight: 1,
                                            opacity: 1,
                                            color: 'red',
                                            fillOpacity: 0.1
                                        }}
                                        interactive={false} // Desativa interações
                                    />
                                )}

                                {/* {showPoligonoAvulso && (
                                    <Polygon
                                        positions={poligonoAvulso.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                        pathOptions={{
                                            color: "red",
                                            fillColor: "red",
                                            fillOpacity: 0.5,
                                            weight: 2
                                        }}
                                    >
                                        <Tooltip sticky className="!text-xs !bg-white !text-gray-800 !border !border-gray-200 !shadow-lg">
                                            <div className="space-y-1">
                                                <p><span className="font-semibold">Polígono:</span> Área Especial</p>
                                            </div>
                                        </Tooltip>
                                    </Polygon>
                                )} */}

                                {/* imoveis - Camada superior */}
                                {showImoveis && imoveis.map((poly) => (
                                    <Polygon
                                        key={poly.id}
                                        positions={poly.coordinates}
                                        eventHandlers={{
                                            mouseover: (e) => {
                                                e.target.setStyle({
                                                    fillOpacity: 0.6,
                                                    weight: 2
                                                });
                                            },
                                            mouseout: (e) => {
                                                e.target.setStyle({
                                                    fillOpacity: 0.3,
                                                    weight: 0.5
                                                });
                                            }
                                        }}
                                        pathOptions={{
                                            color: "blue",
                                            fillOpacity: 0.3,
                                            weight: 0.2,
                                            zIndex: 1000
                                        }}
                                    >
                                        <Tooltip
                                            sticky
                                            className="!text-xs !bg-white !text-gray-800 !border !border-gray-200 !shadow-lg"
                                        >
                                            <div className="space-y-1">
                                                <p><span className="font-semibold">Código:</span> {poly.cd_imovel}</p>
                                                <p><span className="font-semibold">Área:</span> {Number(poly.area).toFixed(2)} ha</p>
                                                <p><span className="font-semibold">Município:</span> {poly.municipio}</p>
                                            </div>
                                        </Tooltip>
                                    </Polygon>
                                ))}

                                {/*reserva*/}
                                {showReserva && reserva.map((poly, i) => (
                                    <Polygon
                                        key={i}
                                        positions={poly.coordinates}
                                        eventHandlers={{
                                            mouseover: (e) => {
                                                e.target.setStyle({
                                                    fillOpacity: 0.6,
                                                    weight: 2
                                                });
                                            },
                                            mouseout: (e) => {
                                                e.target.setStyle({
                                                    fillOpacity: 0.3,
                                                    weight: 0.5
                                                });
                                            }
                                        }}
                                        pathOptions={{
                                            color: "green",
                                            fillOpacity: 0.3,
                                            weight: 0.5,
                                            zIndex: 1000
                                        }}
                                    >
                                        <Tooltip
                                            sticky
                                            className="!text-xs !bg-white !text-gray-800 !border !border-gray-200 !shadow-lg"
                                        >
                                            <div className="space-y-1">
                                                <p><span className="font-semibold">Código:</span> {poly.cd_imovel}</p>
                                                <p><span className="font-semibold">Área:</span> {Number(poly.area).toFixed(2)} ha</p>
                                                <p><span className="font-semibold">Município:</span> {poly.municipio}</p>
                                            </div>
                                        </Tooltip>
                                    </Polygon>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}