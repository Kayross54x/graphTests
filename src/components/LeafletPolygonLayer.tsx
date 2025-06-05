import { Polygon, Tooltip } from 'react-leaflet';
import type { PolygonToPlot } from '../interfaces/PolygonToPlot';

export interface ILeafletPolygonLayer {
	polygon: PolygonToPlot;
	type: string;
	color: string;
}

export default function LeafletPolygonLayer(data: ILeafletPolygonLayer) {
	const {polygon, type, color} = data;

	return (
		<Polygon
			key={polygon.id + " - " + type}
			positions={polygon.coordinates}
			eventHandlers={{
				mouseover: (e: any) => {
					e.target.setStyle({
						fillOpacity: 0.6,
						weight: 2
					});
				},
				mouseout: (e: any) => {
					e.target.setStyle({
						fillOpacity: 0.3,
						weight: 0.5
					});
				}
			}}
			pathOptions={{
				color: color,
				fillOpacity: 0.3,
				weight: 0.2,
				zIndex: 1000
			}}
		>
			<Tooltip
				//@ts-ignore
				sticky
				className="!text-xs !bg-white !text-gray-800 !border !border-gray-200 !shadow-lg"
			>
				<div className="space-y-1">
					<p><span className="font-semibold">Código:</span> {polygon.cd_imovel}</p>
					{polygon?.area && (
						<p><span className="font-semibold">Área:</span> {Number(polygon.area).toFixed(2)} ha</p>
					)}
					{polygon?.municipio && (
						<p><span className="font-semibold">Município:</span> {polygon.municipio}</p>
					)}
				</div>
			</Tooltip>
		</Polygon>
	)
}
