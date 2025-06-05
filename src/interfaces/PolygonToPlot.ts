export interface GeoJsonPropertiesInterface {
	GEOCODIGO: number;
	ID_UF: number;
	LATITUDE: string;
	LONGITUDE: string;
	MESOREGIAO: string;
	MICROREGIA: string;
	NOME: string;
	REGIAO: string;
	UF: string;
}

export interface GeoJsonGeometryInterface {
	type: string;
	coordinates: Array<Array<number>> //checar isso
}

export interface GeoJsonDataInterface {
	type: string;
	geometry: GeoJsonGeometryInterface;
	properties: GeoJsonPropertiesInterface;
}

export interface GeoJsonInterface {
	type: string;
	features: Array<GeoJsonDataInterface>;
}

export interface PolygonToPlot {
	id: string;
	area?: string
	cd_imovel: string;
	coordinates: number[] | [];
	municipio?: string;
}