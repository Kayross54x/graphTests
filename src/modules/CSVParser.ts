import Papa from "papaparse";
import wellknown from "wellknown";

export default class CSVParser {
	public static CsvToLeafletFormat(dataset: string, geometryName: string, type: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			Papa.parse(dataset.trim(), {
				header: true,
				delimiter: ";",
				skipEmptyLines: true,
				complete: (result) => {
					try {
						const parsed = result.data as any[];
						const polys = parsed.flatMap((item, index) => {
							try {
								//@ts-ignore
								const geo = wellknown(item[`${geometryName}`]);
								if (!geo) return null;

								let coordinates;
								if (geo.type === 'Polygon') {
									//@ts-ignore
									coordinates = geo.coordinates[0].map(([lng, lat]) => [lat, lng]);
									return [{
										id: item.cd_imovel,
										municipio: item.ds_municipio,
										cd_imovel: item.cd_imovel,
										area: item.vlr_area_calculada,
										coordinates,
									}];
								} else if (geo.type === 'MultiPolygon') {
									//@ts-ignore
									return geo.coordinates.map((polygonCoords: any, polyIndex: number) => {
										const coordinates = polygonCoords[0].map(([lng, lat]: number[]) => [lat, lng]);
										return {
											id: `${item.cd_imovel} - ${type} ${polyIndex}`,
											municipio: `${item.ds_municipio} - ${type} ${polyIndex}`,
											cd_imovel: `${item.cd_imovel} - ${type} ${polyIndex}`,
											area: item.vlr_area_calculada,
											coordinates,
										};
									});
								} else if (geo.type === 'LineString') {
									coordinates = geo.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
								} else if (geo.type === 'Point') {
									console.warn(`Item ${index}: Found Point geometry, skipping.`);
									return null;
								} else {
									console.warn(`Item ${index}: Unknown geometry type ${geo.type}`);
									return null;
								}

								if (!coordinates) {
									console.error(`Item ${index}: Invalid coordinates.`);
									return null;
								}

								return {
									id: `${item.cd_imovel} - ${type}`,
									municipio: `${item.ds_municipio} - ${type}`,
									cd_imovel: `${item.cd_imovel} - ${type}`,
									area: item.vlr_area_calculada,
									coordinates,
								};
							} catch {
								return null;
							}
						}).filter(item => item !== null);

						resolve(polys);
					} catch (err) {
						reject(err);
					}
				},
				//@ts-ignore
				error: (err) => reject(err),
			});
		});
	}
}
