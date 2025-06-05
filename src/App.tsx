import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import acrelandia from "./mocks/acrelandia.json";
import { useEffect, useState } from "react";
import { imoveisAcrelandia } from "./mocks/imoveis_acrelandia";
import { reservaLegalAcrelandia } from "./mocks/reserva_legal_acrelandia";
import { reservaPermanenteAcrelandia } from "./mocks/reserva_permanente_acrelandia";
import { hidrografiaAcrelandia } from "./mocks/hidrografia_acrelandia";
import CSVParser from "./modules/CSVParser";
import type { GeoJsonInterface, PolygonToPlot } from "./interfaces/PolygonToPlot";
import LeafletPolygonLayer from "./components/LeafletPolygonLayer";

export default function App() {
    const [imoveis, setImoveis] = useState<PolygonToPlot[]>([]);
    const [reserva, setReserva] = useState<PolygonToPlot[]>([]);
    const [municipio, setMunicipio] = useState<GeoJsonInterface | null>(null);
    const [preservacaoPermanente, setPreservacaoPermanente] = useState<PolygonToPlot[]>([]);
    const [hidrografia, setHidrografia] = useState<PolygonToPlot[]>([]);

    const [showMunicipio, setShowMunicipio] = useState(true);
    const [showImoveis, setShowImoveis] = useState(true);
    const [showReserva, setShowReserva] = useState(false);
    const [showPreservacaoPermanente, setShowPreservacaoPermanente] = useState(false);
    const [showHidrografia, setShowHidrografia] = useState(false);
    // const [showPoligonoAvulso, setShowPoligonoAvulso] = useState(true);

    useEffect(() => {
        //@ts-ignore
        setMunicipio(acrelandia);
        getCSVData();
    }, []);

    async function getCSVData() {
        setImoveis(await CSVParser.CsvToLeafletFormat(imoveisAcrelandia, "geometria", "imoveis"));
        setReserva(await CSVParser.CsvToLeafletFormat(reservaLegalAcrelandia, "geometria_nova", "reserva"));
        setPreservacaoPermanente(await CSVParser.CsvToLeafletFormat(reservaPermanenteAcrelandia, "geometria_nova", "preservacaoPermanente"));
        setHidrografia(await CSVParser.CsvToLeafletFormat(hidrografiaAcrelandia, "geometria", "hidrografia"));
    }

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

                                <div className="flex ">
                                    <input
                                        type="checkbox"
                                        id="showPreservacaoPermanente"
                                        checked={showPreservacaoPermanente}
                                        onChange={() => setShowPreservacaoPermanente(!showPreservacaoPermanente)}
                                        className="h-5 w-5 text-orange-400 focus:ring-orange-300 border-gray-300 rounded"
                                    />
                                    <label htmlFor="showReserva" className="ml-2 block text-sm text-gray-700">
                                        Mostrar Áreas de Preservacao Permanente
                                    </label>
                                </div>

                                <div className="flex ">
                                    <input
                                        type="checkbox"
                                        id="showHidrografia"
                                        checked={showHidrografia}
                                        onChange={() => setShowHidrografia(!showHidrografia)}
                                        className="h-4 w-4 text-cyan-400 focus:ring-cyan-300 border-gray-300 rounded"
                                    />
                                    <label htmlFor="showHidrografia" className="ml-2 block text-sm text-gray-700">
                                        Mostrar Hidrografia
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

                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-orange-500 opacity-30 mr-2"></div>
                                    <span className="text-xs text-gray-600">Áreas de Reserva Permanente</span>
                                </div>

                                <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-cyan-500 opacity-30 mr-2"></div>
                                    <span className="text-xs text-gray-600">Hidrografia</span>
                                </div>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div className="flex-1 h-[600px]">
                            <MapContainer
                                //@ts-ignore
                                center={[-9.96783, -66.67577]}
                                zoom={9}
                                className="w-full h-full"
                            >
                                <TileLayer
                                    //@ts-ignore
                                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* GeoJSON - Camada inferior */}
                                {municipio && showMunicipio && (
                                    <GeoJSON
                                        key={`municipio-${showMunicipio}`}
                                        data={municipio}
                                        //@ts-ignore
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
                                {showImoveis && imoveis.map((poly, idx) => (
                                    <LeafletPolygonLayer 
                                        polygon={poly}
                                        type={"imoveis " + idx}
                                        color="blue"
                                    />
                                ))}

                                {/*reserva*/}
                                {showReserva && reserva.map((poly, idx) => (
                                    <LeafletPolygonLayer 
                                        polygon={poly}
                                        type={"reserva " + idx}
                                        color="green"
                                    />
                                ))}

                                {/* preservacao - Camada superior */}
                                {showPreservacaoPermanente && preservacaoPermanente.map((poly, idx) => (
                                    <LeafletPolygonLayer 
                                        polygon={poly}
                                        type={"preservacao " + idx}
                                        color="olive"
                                    />
                                ))}

                                {showHidrografia && hidrografia.map((poly, idx) => (
                                    <LeafletPolygonLayer 
                                        polygon={poly}
                                        type={"hidro " + idx}
                                        color="turquoise"
                                    />
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}